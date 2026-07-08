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

## Going live (MEI-26)

Needs a **functions-capable host** (surge.sh is static-only) — the same host
that unblocks checkout (MEI-23). On that host:

1. **Real email delivery.** Create a free Resend account, verify the meish
   sending domain, and set `RESEND_API_KEY` as an env var. OUTBOX flips to real
   send with **no code change**. Confirm `RESERVE_NOTIFY_EMAIL=moona.m@meish.work`
   and set `RESERVE_FROM_EMAIL` to an address on the verified domain.
2. **CAPTCHA (Cloudflare Turnstile).** Create a Turnstile widget at
   dash.cloudflare.com → Turnstile (free), then set all three:
   - `PUBLIC_TURNSTILE_SITE_KEY` — public site key (baked into the form HTML at
     build; **rebuild** after setting it).
   - `TURNSTILE_SECRET_KEY` — secret, server-side only.
   - `RESERVE_REQUIRE_CAPTCHA=1` — turns the server gate on.

   With the site key set, the widget renders on the form; the client needs no
   other change (Turnstile injects `cf-turnstile-response`, which rides along in
   both the no-JS POST and the enhanced fetch). The server verifies the token in
   `POST /api/reserve` **before** any store or email, and **fails closed**: if
   the gate is on but the secret is missing/invalid, the request is rejected —
   a misconfiguration can never silently disable anti-abuse.
3. **Rate-limit store.** The in-memory limiter is correct for a single-node
   deploy. If the host runs **multiple instances**, back `hit()` in `antispam.ts`
   with a shared store (KV/Redis) so the window is global; pick the store once
   the host is chosen (Cloudflare KV pairs with a Pages/Workers host).

All env vars are documented in `.env.example`. Keyless (no `RESEND_API_KEY`, no
Turnstile keys) stays fully functional for dev/OUTBOX — nothing above is
required to run the flow locally.

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

5. **CAPTCHA (Cloudflare Turnstile)** — verified server-side in the route
   before `saveReservation`, gated on `RESERVE_REQUIRE_CAPTCHA=1` and fail-closed.
   See `verifyCaptcha()` in `antispam.ts` and the go-live steps above. Built in
   MEI-26; off (keyless) by default so dev/OUTBOX is unaffected.
