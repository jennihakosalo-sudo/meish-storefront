// Meish Printed — transactional email (MEI-20).
//
// Two emails go out on every reservation:
//   1. a NOTIFY email to the studio (moona.m@meish.work) — "someone reserved X",
//   2. a CONFIRMATION email to the customer — "we've got your reservation".
//
// Provider is pluggable and chosen at runtime:
//   • If RESEND_API_KEY is set → send for real via Resend's HTTP API (free tier,
//     no SDK/dependency; a one-file swap for SendGrid/Postmark if we change our
//     minds). Resend is recommended because it needs a single API key and no
//     SMTP plumbing.
//   • Otherwise → OUTBOX mode: the fully-rendered email (to, subject, body) is
//     written to .data/outbox/ and logged. Nothing is sent, but the exact
//     message we *would* send is captured. This lets the whole reserve flow run
//     — and be proven — locally with zero secrets, exactly like the Stripe path
//     degrades without a key (see docs/CHECKOUT.md). Real delivery is then a
//     drop-in once the studio provisions RESEND_API_KEY for the live site.
//
// Set RESERVE_NOTIFY_EMAIL / RESERVE_FROM_EMAIL to override the defaults.

import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import type { Reservation } from './reservations';

export interface EmailMessage {
  to: string;
  subject: string;
  /** Plain-text body. Kept text-only for deliverability and simplicity. */
  text: string;
  /** Reply-To, so studio replies to a notify land in the customer's inbox. */
  replyTo?: string;
}

export interface SendResult {
  delivered: boolean;
  provider: 'resend' | 'outbox';
  /** Provider message id, or the outbox filename. */
  id: string;
}

const DEFAULT_NOTIFY = 'moona.m@meish.work';

/**
 * All studio-notify recipients. `RESERVE_NOTIFY_EMAIL` may be a comma-separated
 * list, so a live-monitored inbox (e.g. the CoS anti-abuse watch, MEI-21/28)
 * receives the "new reservation" email DIRECTLY via Resend — never via a
 * mailbox auto-forward. This matters: Gmail auto-forwarding does not forward
 * Spam-classified mail, so a forward-based monitor would miss the expected
 * spam/scam wave. A direct Resend recipient is not subject to that.
 */
export function notifyRecipients(): string[] {
  const raw = process.env.RESERVE_NOTIFY_EMAIL ?? DEFAULT_NOTIFY;
  const list = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return list.length ? list : [DEFAULT_NOTIFY];
}

/**
 * Primary studio address — the first of `notifyRecipients()`. Used as the
 * customer confirmation's Reply-To (a single address, so replies land in one
 * studio inbox).
 */
export function notifyAddress(): string {
  return notifyRecipients()[0];
}

export function fromAddress(): string {
  return process.env.RESERVE_FROM_EMAIL ?? 'Meish Printed <hello@meish.work>';
}

export function hasEmailProvider(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

function outboxDir(): string {
  return resolve(process.env.OUTBOX_DIR ?? '.data/outbox');
}

/** Send one email. Never throws for a provider failure — returns delivered:false. */
export async function sendEmail(msg: EmailMessage): Promise<SendResult> {
  if (hasEmailProvider()) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          from: fromAddress(),
          // `to` may carry a comma-separated list (studio + monitor); Resend
          // wants an array of individual addresses.
          to: msg.to
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          subject: msg.subject,
          text: msg.text,
          ...(msg.replyTo ? { reply_to: msg.replyTo } : {}),
        }),
      });
      if (!res.ok) {
        console.error('[email] resend failed:', res.status, await res.text());
        return { delivered: false, provider: 'resend', id: `error_${res.status}` };
      }
      const body = (await res.json()) as { id?: string };
      return { delivered: true, provider: 'resend', id: body.id ?? 'sent' };
    } catch (err) {
      console.error('[email] resend threw:', err);
      return { delivered: false, provider: 'resend', id: 'error_network' };
    }
  }

  // OUTBOX mode — capture the message instead of sending it.
  const stamp = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const safeTo = msg.to.replace(/[^a-zA-Z0-9_.@-]/g, '_');
  const file = `${stamp}-${safeTo}.txt`;
  const contents =
    `To: ${msg.to}\n` +
    `From: ${fromAddress()}\n` +
    (msg.replyTo ? `Reply-To: ${msg.replyTo}\n` : '') +
    `Subject: ${msg.subject}\n` +
    `\n${msg.text}\n`;
  try {
    await mkdir(outboxDir(), { recursive: true });
    await writeFile(join(outboxDir(), file), contents, 'utf8');
    console.log(`[email] OUTBOX (no RESEND_API_KEY): wrote ${file} → ${msg.to}`);
  } catch (err) {
    console.error('[email] outbox write failed:', err);
    return { delivered: false, provider: 'outbox', id: 'error_write' };
  }
  return { delivered: false, provider: 'outbox', id: file };
}

/* --- Message templates ---------------------------------------------------- */

/** Studio-facing "new reservation" email. */
export function buildNotifyEmail(r: Reservation): EmailMessage {
  return {
    to: notifyRecipients().join(', '),
    replyTo: r.customer.email,
    subject: `New reservation — ${r.product.name} ×${r.quantity} (${r.customer.name})`,
    text:
      `A new reserve-interest request just came in.\n\n` +
      `Product:  ${r.product.name} (${r.product.slug})\n` +
      `Quantity: ${r.quantity}\n` +
      `Name:     ${r.customer.name}\n` +
      `Email:    ${r.customer.email}\n` +
      `Note:     ${r.note || '—'}\n\n` +
      `Reservation id: ${r.id}\n` +
      `Received: ${r.createdAt}\n` +
      `Source:   ${r.meta.source}\n\n` +
      `Reply to this email to reach the customer directly.`,
  };
}

/** Customer-facing confirmation email. */
export function buildConfirmationEmail(r: Reservation): EmailMessage {
  return {
    to: r.customer.email,
    replyTo: notifyAddress(),
    subject: `We've got your reservation — ${r.product.name}`,
    text:
      `Hi ${r.customer.name},\n\n` +
      `Thank you — your reservation is in. No payment yet; this simply holds\n` +
      `your interest and tells us what you'd like printed. We'll reply by email\n` +
      `to talk through the details and a quote.\n\n` +
      `Here's what we noted:\n` +
      `  • Product:  ${r.product.name}\n` +
      `  • Quantity: ${r.quantity}\n` +
      (r.note ? `  • Your note: ${r.note}\n` : '') +
      `\nReference: ${r.id}\n\n` +
      `If anything's off, just reply to this email.\n\n` +
      `— Meish Printed`,
  };
}
