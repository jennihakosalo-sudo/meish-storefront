# Reserve-interest flow (MEI-20)

The reserve flow lets a customer say *"I'd like this printed"* **before any card
is charged** (payments are MEI-4, separate). On submit it: runs an anti-spam
gate → stores the reservation → emails the studio → confirms the customer.

## Pieces

| File | Role |
| --- | --- |
| `src/components/ReserveForm.astro` | The form. Works with **no JS** (plain POST); enhanced by the script below. On the product detail page and `/reserve`. |
| `src/scripts/reserve.ts` | Progressive enhancement: stamps the time-trap, submits via fetch, shows an inline result. |
| `src/pages/api/reserve.ts` | `POST /api/reserve`. Accepts JSON (enhanced) or form-encoded (no-JS). `prerender = false`. |
| `src/lib/antispam.ts` | Honeypot, time-trap, server-side validation, per-IP + per-email rate limiting. CAPTCHA hook (`captchaRequired`). |
| `src/lib/reservations.ts` | Storage. MVP = one JSON file per reservation under `.data/reservations`; swap for Airtable/Sheets/DB via the same interface. |
| `src/lib/email.ts` | Two transactional emails (studio notify + customer confirm) via Resend, or OUTBOX capture without a key. |
| `src/pages/reserve/thanks.astro` | Landing page for the no-JS POST. |

## Running it locally (zero secrets)

```sh
npm run build
node ./dist/server/entry.mjs            # serves on http://localhost:4321
```

With no `RESEND_API_KEY`, the flow is fully exercised in **OUTBOX mode**:

- the reservation is written to `.data/reservations/<id>.json`,
- both emails are written to `.data/outbox/*.txt` (exactly what we'd send),
- the API returns `{ ok: true, id }`.

That proves *stored + emailed + confirmed* without a single credential — the same
way the Stripe path degrades gracefully without a key (see `CHECKOUT.md`).

## Going live

Set `RESEND_API_KEY` (and verify the `RESERVE_FROM_EMAIL` domain in Resend).
OUTBOX mode flips to real delivery — no code change. All env vars are documented
in `.env.example`.

## Anti-spam (built in from day one — we expect a spam wave at publish)

Cheapest-first, so bots are dropped before they cost us a write or an email:

1. **Honeypot** — hidden `company` field; any value → silently dropped (200).
2. **Time-trap** — client stamps `_ts`; a submit faster than 1.5s → dropped.
   Missing `_ts` (no-JS) is allowed, so we never punish progressive enhancement.
3. **Server-side validation** — required fields, email shape, quantity bounds,
   length caps.
4. **Rate limiting** — sliding window per IP (5 / 10 min) and per email
   (3 / 60 min). In-memory for the single-node MVP; back it with a shared store
   (KV/Redis) on a multi-instance deploy.

**Deferred to before public launch (MEI-21):** a CAPTCHA / Cloudflare Turnstile
challenge. The wiring point already exists — `captchaRequired()` in
`antispam.ts`; flip `RESERVE_REQUIRE_CAPTCHA=1` once keys are provisioned and
verify the token in the route before `saveReservation`.
