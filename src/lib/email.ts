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
import type { FulfillmentStatus, Order } from './orders';
import { formatPrice } from './pricing';

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

/* --- Order + fulfillment emails (MEI-5) ----------------------------------
   Paid orders get a confirmation to the customer and a routing summary to the
   studio, then a status email each time fulfillment advances. All go through
   the same sendEmail() → Resend-or-OUTBOX path as the reserve emails. */

function orderLines(order: Order): string {
  return order.items
    .map(
      (it) =>
        `  • ${it.quantity} × ${it.name} — ${formatPrice(
          it.unitAmountCents * it.quantity,
          order.currency,
        )}${it.artifact ? `\n      Design: ${it.artifact}` : ''}`,
    )
    .join('\n');
}

/** Customer-facing paid-order confirmation. */
export function buildOrderConfirmationEmail(order: Order): EmailMessage {
  return {
    to: order.customer.email ?? '',
    replyTo: notifyAddress(),
    subject: `Order confirmed — Meish Printed (${order.id.slice(-8)})`,
    text:
      `Hi ${order.customer.name ?? 'there'},\n\n` +
      `Thank you — your payment went through and your order is confirmed.\n` +
      `We're now sending it to print.\n\n` +
      `${orderLines(order)}\n\n` +
      `Total paid: ${formatPrice(order.amountTotalCents, order.currency)}\n` +
      `Order reference: ${order.id}\n\n` +
      `We'll email you again when your order goes into production and when it\n` +
      `ships. You can reply to this email any time with questions.\n\n` +
      `— Meish Printed`,
  };
}

/** Studio-facing "new paid order" email, with the fulfillment routing outcome. */
export function buildStudioOrderNotifyEmail(order: Order): EmailMessage {
  const f = order.fulfillment;
  const routing = f
    ? f.status === 'needs_artwork'
      ? `⚠️  NEEDS MANUAL HANDLING — ${f.error ?? 'no auto-route'}`
      : `Routed to ${f.provider} (${f.status})` +
        (f.providerOrderId ? ` — provider order ${f.providerOrderId}` : '')
    : 'Not yet routed';
  const ship = order.shipping?.address;
  return {
    to: notifyRecipients().join(', '),
    replyTo: order.customer.email ?? undefined,
    subject: `New paid order — ${formatPrice(order.amountTotalCents, order.currency)} (${
      order.customer.name ?? order.customer.email ?? 'customer'
    })`,
    text:
      `A paid order just came in.\n\n` +
      `${orderLines(order)}\n\n` +
      `Total: ${formatPrice(order.amountTotalCents, order.currency)}\n` +
      `Customer: ${order.customer.name ?? '—'} <${order.customer.email ?? '—'}>\n` +
      `Ship to: ${
        ship
          ? `${ship.line1}${ship.line2 ? ', ' + ship.line2 : ''}, ${ship.city} ${
              ship.postalCode ?? ''
            }, ${ship.country}`
          : '— (no address collected)'
      }\n\n` +
      `Fulfillment: ${routing}\n` +
      `Order reference: ${order.id}\n`,
  };
}

/** Customer-facing status update as fulfillment advances. */
export function buildOrderStatusEmail(order: Order, status: FulfillmentStatus): EmailMessage {
  const tracking = order.fulfillment?.tracking;
  const headlines: Partial<Record<FulfillmentStatus, string>> = {
    in_production: `Your order is now being printed`,
    shipped: `Your order is on its way`,
    delivered: `Your order has been delivered`,
    canceled: `Your order has been canceled`,
  };
  const bodies: Partial<Record<FulfillmentStatus, string>> = {
    in_production:
      `Good news — your order is now in production. We'll let you know the\n` +
      `moment it ships.`,
    shipped:
      `Your order has shipped.` +
      (tracking?.code
        ? `\n\nTracking: ${tracking.code}${tracking.carrier ? ` (${tracking.carrier})` : ''}` +
          (tracking.url ? `\n${tracking.url}` : '')
        : ''),
    delivered: `Your order has been delivered. We hope you love it — thank you for\nsupporting Meish Printed.`,
    canceled: `Your order has been canceled. If this is unexpected, just reply and\nwe'll sort it out.`,
  };
  return {
    to: order.customer.email ?? '',
    replyTo: notifyAddress(),
    subject: `${headlines[status] ?? 'Order update'} — Meish Printed (${order.id.slice(-8)})`,
    text:
      `Hi ${order.customer.name ?? 'there'},\n\n` +
      `${bodies[status] ?? `Your order status is now: ${status}.`}\n\n` +
      `Order reference: ${order.id}\n\n` +
      `— Meish Printed`,
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
