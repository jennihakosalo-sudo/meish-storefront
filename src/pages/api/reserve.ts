// POST /api/reserve — record a reserve-interest request (MEI-20).
//
// No card is charged. The flow is: anti-spam gate → store → email the studio
// and confirm the customer. It accepts BOTH a JSON body (the enhanced fetch
// path) and a classic form POST (the no-JS fallback), so the form works even
// with scripting disabled. JSON callers get JSON back; form callers are 303'd
// to /reserve/thanks.
//
// Anti-spam order is cheapest-first (honeypot/time-trap → validate → rate-limit)
// so bots are dropped before they cost us a write or an email. See
// src/lib/antispam.ts and docs/RESERVE.md.

import type { APIRoute } from 'astro';
import { products } from '../../data/products';
import {
  newReservationId,
  saveReservation,
  type Reservation,
} from '../../lib/reservations';
import {
  buildNotifyEmail,
  buildConfirmationEmail,
  sendEmail,
} from '../../lib/email';
import {
  HONEYPOT_FIELD,
  honeypotTripped,
  timeTrapTripped,
  validateReservation,
  rateLimit,
} from '../../lib/antispam';

export const prerender = false;

const VALID_SLUGS: ReadonlySet<string> = new Set(products.map((p) => p.slug));
const PRODUCT_NAMES = new Map(products.map((p) => [p.slug, p.name] as const));

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

/** First hop of X-Forwarded-For, else the socket address. */
function clientIp(request: Request, fallback: string | undefined): string | null {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return fallback ?? null;
}

/** Normalise JSON or form bodies into a single field accessor. */
async function readFields(request: Request): Promise<Record<string, FormDataEntryValue | null>> {
  const ct = request.headers.get('content-type') ?? '';
  if (ct.includes('application/json')) {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const out: Record<string, FormDataEntryValue | null> = {};
    for (const [k, v] of Object.entries(body)) {
      out[k] = v == null ? null : String(v);
    }
    return out;
  }
  const form = await request.formData();
  const out: Record<string, FormDataEntryValue | null> = {};
  for (const [k, v] of form.entries()) out[k] = v;
  return out;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ct = request.headers.get('content-type') ?? '';
  const wantsJson = ct.includes('application/json');
  const fields = await readFields(request);

  // 1. Honeypot — a filled hidden field means a bot. Answer 200 so the bot
  //    can't distinguish success from rejection, but store/send nothing.
  if (honeypotTripped(fields[HONEYPOT_FIELD])) {
    console.warn('[reserve] honeypot tripped — dropped');
    return wantsJson ? json({ ok: true, id: null }) : redirectThanks();
  }

  // 2. Time-trap — implausibly fast submit from the enhanced form.
  const tsRaw = typeof fields._ts === 'string' ? Number.parseInt(fields._ts, 10) : NaN;
  const elapsed = Number.isFinite(tsRaw) ? Date.now() - tsRaw : null;
  if (timeTrapTripped(elapsed)) {
    console.warn('[reserve] time-trap tripped — dropped');
    return wantsJson ? json({ ok: true, id: null }) : redirectThanks();
  }

  // 3. Server-side validation.
  const v = validateReservation(
    {
      name: fields.name ?? null,
      email: fields.email ?? null,
      productSlug: fields.productSlug ?? fields.product ?? null,
      quantity: fields.quantity ?? null,
      note: fields.note ?? null,
    },
    VALID_SLUGS,
  );
  if (!v.ok || !v.value) {
    if (wantsJson) return json({ ok: false, errors: v.errors }, 422);
    return redirectThanks(false);
  }
  const input = v.value;

  // 4. Rate limiting — per IP and per email.
  const ip = clientIp(request, clientAddress);
  const verdict = rateLimit(ip, input.email);
  if (!verdict.allowed) {
    console.warn(`[reserve] rate limited (${verdict.scope})`, ip, input.email);
    const msg = 'Too many reservations from here just now — please try again later.';
    if (wantsJson) return json({ ok: false, errors: { _: msg } }, 429);
    return redirectThanks(false);
  }

  // Build + store the reservation.
  const source =
    typeof fields.source === 'string' && fields.source ? fields.source : 'unknown';
  const reservation: Reservation = {
    id: newReservationId(),
    createdAt: new Date().toISOString(),
    status: 'new',
    product: {
      slug: input.productSlug,
      name:
        input.productSlug === 'unspecified'
          ? 'General enquiry'
          : PRODUCT_NAMES.get(input.productSlug) ?? input.productSlug,
    },
    quantity: input.quantity,
    customer: { name: input.name, email: input.email },
    note: input.note,
    notify: null,
    confirmation: null,
    meta: {
      ip,
      userAgent: request.headers.get('user-agent'),
      source,
    },
  };

  try {
    await saveReservation(reservation);
  } catch (err) {
    console.error('[reserve] store failed:', err);
    const msg = 'We could not save your reservation — please try again.';
    if (wantsJson) return json({ ok: false, errors: { _: msg } }, 500);
    return redirectThanks(false);
  }

  // Email the studio and confirm the customer. Best-effort: a mail failure must
  // not lose an already-stored reservation, so we record the outcome and move
  // on. (In OUTBOX mode both are "written but not delivered".)
  const [notify, confirmation] = await Promise.all([
    sendEmail(buildNotifyEmail(reservation)),
    sendEmail(buildConfirmationEmail(reservation)),
  ]);
  reservation.notify = { delivered: notify.delivered, provider: notify.provider };
  reservation.confirmation = {
    delivered: confirmation.delivered,
    provider: confirmation.provider,
  };
  try {
    await saveReservation(reservation); // persist delivery outcome
  } catch (err) {
    console.error('[reserve] outcome persist failed (non-fatal):', err);
  }

  console.log(
    `[reserve] stored ${reservation.id} — notify:${notify.provider}/${notify.delivered} ` +
      `confirm:${confirmation.provider}/${confirmation.delivered}`,
  );

  if (wantsJson) {
    return json({
      ok: true,
      id: reservation.id,
      delivered: notify.delivered && confirmation.delivered,
    });
  }
  return redirectThanks(true);
};

function redirectThanks(ok = true): Response {
  return new Response(null, {
    status: 303,
    headers: { location: ok ? '/reserve/thanks' : '/reserve?error=1' },
  });
}
