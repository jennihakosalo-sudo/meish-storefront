// Meish Printed — reserve-flow anti-spam (MEI-20).
//
// We expect a scam/spam wave the moment the store is public, so abuse defence
// is built into the reserve flow from day one — not bolted on later. Layers,
// cheapest-first so a bot is rejected before it costs us a write or an email:
//
//   1. HONEYPOT — a hidden `company` field. Real users never see it; bots that
//      blindly fill every input do. Any value → silently rejected.
//   2. TIME-TRAP — the client stamps `_ts` (page-load time) on submit. A submit
//      faster than MIN_FILL_MS is almost certainly scripted. Absent `_ts`
//      (no-JS user) is allowed — we don't punish progressive enhancement.
//   3. SERVER-SIDE VALIDATION — never trust the client. Required fields, email
//      shape, quantity bounds, and length caps that also blunt payload abuse.
//   4. RATE LIMITING — sliding window per IP and per email, so one source can't
//      flood reservations or the notify inbox.
//
// Deliberately deferred to before public launch (tracked on MEI-21): a CAPTCHA
// / Turnstile challenge — see `captchaRequired()` for the single hook where it
// slots in. In-memory rate-limit state is fine for the single-node MVP; a
// multi-instance deploy should back `hit()` with a shared store (KV/Redis).

export const HONEYPOT_FIELD = 'company';
const MIN_FILL_MS = 1500;

const LIMITS = {
  /** Per client IP. */
  ip: { max: 5, windowMs: 10 * 60_000 },
  /** Per email address (across IPs). */
  email: { max: 3, windowMs: 60 * 60_000 },
};

export interface ReservationInput {
  name: string;
  email: string;
  productSlug: string;
  quantity: number;
  note: string;
}

export interface ValidationResult {
  ok: boolean;
  /** Field → human-readable error, when ok is false. */
  errors: Record<string, string>;
  /** Normalised, trimmed values, when ok is true. */
  value?: ReservationInput;
}

// Pragmatic email shape check — not RFC-complete, just enough to reject junk
// while accepting real addresses. Real validation is the confirmation email.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(v: FormDataEntryValue | null | undefined): string {
  return typeof v === 'string' ? v.trim() : '';
}

/**
 * Honeypot trip: true means the hidden field was filled → treat as a bot.
 * Accepts the raw field value.
 */
export function honeypotTripped(value: FormDataEntryValue | null | undefined): boolean {
  return str(value).length > 0;
}

/**
 * Time-trap trip: true means the form was submitted implausibly fast.
 * `elapsedMs` is (now - client `_ts`). Missing/invalid `_ts` → not tripped
 * (no-JS users have no timestamp and must still be able to submit).
 */
export function timeTrapTripped(elapsedMs: number | null): boolean {
  if (elapsedMs === null || !Number.isFinite(elapsedMs) || elapsedMs < 0) return false;
  return elapsedMs < MIN_FILL_MS;
}

/** Server-side validation. `validSlugs` = the set of real catalogue slugs. */
export function validateReservation(
  raw: {
    name: FormDataEntryValue | null;
    email: FormDataEntryValue | null;
    productSlug: FormDataEntryValue | null;
    quantity: FormDataEntryValue | null;
    note: FormDataEntryValue | null;
  },
  validSlugs: ReadonlySet<string>,
): ValidationResult {
  const errors: Record<string, string> = {};

  const name = str(raw.name);
  if (name.length < 2) errors.name = 'Please tell us your name.';
  else if (name.length > 80) errors.name = 'That name is too long.';

  const email = str(raw.email).toLowerCase();
  if (!email) errors.email = 'An email is required so we can reply.';
  else if (email.length > 254 || !EMAIL_RE.test(email))
    errors.email = 'That email address looks off.';

  const productSlug = str(raw.productSlug) || 'unspecified';
  if (productSlug !== 'unspecified' && !validSlugs.has(productSlug))
    errors.productSlug = 'Unknown product.';

  const qtyRaw = str(raw.quantity);
  const quantity = Number.parseInt(qtyRaw, 10);
  if (!Number.isInteger(quantity) || quantity < 1)
    errors.quantity = 'Quantity must be at least 1.';
  else if (quantity > 9999) errors.quantity = 'That quantity is too large.';

  const note = str(raw.note);
  if (note.length > 2000) errors.note = 'Please keep the note under 2000 characters.';

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, errors: {}, value: { name, email, productSlug, quantity, note } };
}

/* --- Rate limiting -------------------------------------------------------- */

const hits = new Map<string, number[]>();

function withinWindow(key: string, max: number, windowMs: number, now: number): boolean {
  const cutoff = now - windowMs;
  const recent = (hits.get(key) ?? []).filter((t) => t > cutoff);
  if (recent.length >= max) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}

export interface RateVerdict {
  allowed: boolean;
  /** Which bucket rejected, for logging. */
  scope?: 'ip' | 'email';
}

/**
 * Record a reservation attempt and decide if it's allowed. Checks the IP bucket
 * first, then the email bucket; a rejection in either fails the request. Call
 * once per accepted-shape submission.
 */
export function rateLimit(ip: string | null, email: string, now = Date.now()): RateVerdict {
  if (ip && !withinWindow(`ip:${ip}`, LIMITS.ip.max, LIMITS.ip.windowMs, now))
    return { allowed: false, scope: 'ip' };
  if (!withinWindow(`email:${email}`, LIMITS.email.max, LIMITS.email.windowMs, now))
    return { allowed: false, scope: 'email' };
  return { allowed: true };
}

/**
 * Pre-launch hook: whether a CAPTCHA/Turnstile token must be verified before a
 * reservation is accepted. Off for the MVP; flip via RESERVE_REQUIRE_CAPTCHA=1
 * once keys are provisioned (MEI-21/MEI-26). Kept here so the wiring point is
 * explicit.
 */
export function captchaRequired(): boolean {
  return process.env.RESERVE_REQUIRE_CAPTCHA === '1';
}

/* --- CAPTCHA (Cloudflare Turnstile) --------------------------------------- */

/**
 * The form field Turnstile injects with the challenge token. The widget adds a
 * hidden `<input name="cf-turnstile-response">`, so it rides along in both the
 * form POST and the enhanced fetch's FormData with no extra client wiring.
 */
export const CAPTCHA_TOKEN_FIELD = 'cf-turnstile-response';

const TURNSTILE_VERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export interface CaptchaVerdict {
  ok: boolean;
  /** Machine-readable reason, for logging. */
  reason?: 'disabled-ok' | 'misconfigured' | 'missing-token' | 'rejected' | 'error';
}

/**
 * Verify a Turnstile token server-side before a reservation is accepted.
 *
 * Fail-closed by design: this is only reached when RESERVE_REQUIRE_CAPTCHA=1,
 * i.e. the operator explicitly turned the gate on. If it's on but the secret is
 * missing, or the token is absent/invalid, we REJECT — a misconfiguration must
 * not silently disable anti-abuse. When the gate is off we short-circuit to ok
 * so dev/OUTBOX runs keyless.
 *
 * Never throws: a network error against Cloudflare returns a rejection verdict
 * the caller turns into a retriable 4xx, not a 500.
 */
export async function verifyCaptcha(
  token: string | null | undefined,
  remoteIp: string | null,
): Promise<CaptchaVerdict> {
  if (!captchaRequired()) return { ok: true, reason: 'disabled-ok' };

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // Gate is on but we cannot verify — refuse rather than wave traffic through.
    console.error(
      '[antispam] RESERVE_REQUIRE_CAPTCHA=1 but TURNSTILE_SECRET_KEY is unset — rejecting.',
    );
    return { ok: false, reason: 'misconfigured' };
  }

  const t = typeof token === 'string' ? token.trim() : '';
  if (!t) return { ok: false, reason: 'missing-token' };

  const body = new URLSearchParams({ secret, response: t });
  if (remoteIp) body.set('remoteip', remoteIp);

  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body,
    });
    const data = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      'error-codes'?: string[];
    };
    if (data.success) return { ok: true };
    console.warn('[antispam] turnstile rejected:', data['error-codes'] ?? '(no codes)');
    return { ok: false, reason: 'rejected' };
  } catch (err) {
    console.error('[antispam] turnstile verify threw:', err);
    return { ok: false, reason: 'error' };
  }
}

/** Test-only: clear rate-limit state between runs. */
export function __resetRateLimit(): void {
  hits.clear();
}
