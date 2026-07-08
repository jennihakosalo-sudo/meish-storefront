# Reserve email deliverability — verification & go-live runbook (MEI-28)

Ties into **MEI-26** (go-live) and unblocks **MEI-21** (anti-abuse inbox
monitoring). The reserve route (`POST /api/reserve`) sends two emails on every
reservation: a **studio notify** to `RESERVE_NOTIFY_EMAIL` and a **customer
confirmation** to the submitter. If the notify path is dead, every reservation
(and the expected spam/scam wave) disappears silently and monitoring sees
nothing. This doc records what was verified and the exact steps to close it at
go-live.

## What was verified (2026-07-09, pre-host)

| Check | Result |
| --- | --- |
| `meish.work` can receive mail | ✅ **Yes** — MX = `smtp.google.com` (Google Workspace). |
| `moona.m@meish.work` is a real mailbox | ✅ **Yes, live & paid** — it sent a shared-drive invite (2026‑05‑27) and the Workspace subscription is now on paid billing. |
| `moona.m@meish.work` → `jenni.hakosalo@gmail.com` auto-forward | ⚠️ **Requested but not provably active.** Google's forward-confirmation email (2026‑05‑27) is in the inbox with its "click to confirm" link. Gmail requires that click to activate; **no externally-addressed `to:moona.m@meish.work` mail has ever landed** in `jenni.hakosalo@gmail.com`, so activation is unconfirmed (could be no traffic yet, or never confirmed). |
| `meishprinted.com` (store host, MEI‑23) | ❌ **Not purchased** — no MX / no A record. The functions-capable host does not exist yet. |

### Red herring corrected
The original MEI‑21 alarm was that **`jenni@meish.work` bounced** ("Address not
found"). That address was **never provisioned** and is unrelated to
`moona.m@meish.work`, which is the studio owner's live primary account. The
bounce does **not** imply the shop address is dead.

### Critical risk for anti-abuse monitoring
**Gmail auto-forwarding does not forward Spam-classified mail.** Even if the
`moona.m → jenni` forward is active, the scam/spam wave the CoS wants to watch
would be filtered into `moona.m`'s Spam folder and **never forwarded**. A
forward is therefore the wrong mechanism for the anti-abuse monitor.

## The fix (already in code)

`RESERVE_NOTIFY_EMAIL` now accepts a **comma-separated list**, and the notify
email is sent to each recipient **directly via Resend** (see `src/lib/email.ts`,
`notifyRecipients()`). A direct Resend recipient is a normal transactional
delivery — **not** subject to the forward's don't-forward-spam behavior — so the
monitor inbox sees everything, including spam attempts. Belt-and-braces: every
reservation is also persisted server-side (`.data/reservations/<id>.json`) and
both emails are captured to `.data/outbox` regardless of delivery outcome, so a
reservation is **never** silently lost even if all mail delivery fails.

## Go-live runbook (do on the MEI‑23 host, before opening the public form)

1. Set `RESEND_API_KEY` (Resend, meish sending domain verified).
2. Set `RESERVE_FROM_EMAIL` to an address on the verified domain.
3. Set `RESERVE_NOTIFY_EMAIL=moona.m@meish.work,jenni.hakosalo@gmail.com`
   — studio + anti-abuse monitor, both direct via Resend (no forward dependency).
4. Set `RESERVE_REQUIRE_CAPTCHA=1` plus `TURNSTILE_SECRET_KEY` and
   `PUBLIC_TURNSTILE_SITE_KEY`, then **rebuild** (site key is baked at build).
5. **Live test — acceptance:** submit one real reservation through the deployed
   `/api/reserve`. Confirm:
   - the **studio notify** lands in `jenni.hakosalo@gmail.com` (and `moona.m`),
   - the **customer confirmation** is delivered to the submitter address,
   - `.data/reservations/<id>.json` shows `notify.delivered:true` and
     `confirmation.delivered:true` with `provider:"resend"`.
6. Only after (5) passes green, open the public reserve form.

## Optional immediate de-risk (does not need the host)
Have Moona (a) confirm she clicked the 2026‑05‑27 Gmail forwarding link, and
(b) send a test email from any outside address to `moona.m@meish.work` and check
it arrives in `jenni.hakosalo@gmail.com`. This closes the forward-activation
question early — though step 3 above makes the launch monitor **not depend** on
the forward regardless.
