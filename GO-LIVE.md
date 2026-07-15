# Meish — Go-Live Runbook

Status as of 2026-07-15. This site now serves **two arms** at `meish.work`:
- **Meish World / shop** (existing): `/shop`, `/design/*`, `/reserve`, `/cart` — Stripe + Decap CMS + Gelato.
- **Meish B2B / Experience Ops** (new): `/services` + `/services/{experience-audits,cleanliness-audits,clara,aviation}`, `/philosophy`, `/privacy`, `/contact`.

Local build is green (`npm run build`) and all routes render.

---

## 0. Brand decision (do first — affects copy/nav)

The shell is still branded **"Meish Printed"** (wordmark + "Shop the studio" CTA in `src/components/Header.astro`, and defaults in `src/layouts/Base.astro`). The B2B pages read as **"Meish — Experience Ops."** Decide the unified identity before publishing:
- **Option A** — one masthead "Meish", shop presented as "Meish World". Update wordmark, Base default title/description, header CTA.
- **Option B** — keep two sub-brands visually distinct under one domain.

Nothing else here is blocked by this, but the public face is.

## 1. Accounts & assets you provide

- [ ] **Cloudflare account** + `meish.work` added to Cloudflare DNS
- [ ] **GitHub repo** (or other) as git remote — repo currently has **no remote**
- [ ] **Logo suite** (only 2 PNGs exist today — insufficient)
- [ ] **`hello@meish.work`** mailbox live (contact page currently uses `moona.m@meish.work`)
- [ ] Founder photo (for `/about`, when built as B2B)

## 2. Production environment variables (set in Cloudflare Pages)

From `.env.example`:
- [ ] `STRIPE_SECRET_KEY` (live `sk_live_…`) + `STRIPE_WEBHOOK_SECRET`
- [ ] `PUBLIC_SITE_URL=https://meish.work`
- [ ] `RESEND_API_KEY` + `RESERVE_FROM_EMAIL` (verified domain)
- [ ] `PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` + `RESERVE_REQUIRE_CAPTCHA=true`
- [ ] `GELATO_API_KEY` (+ `FULFILLMENT_SKU_MAP`) — else fulfillment stays dry-run
- [ ] Move order/reservation stores off local disk (`.data/*`) before real traffic

## 3. Deploy

```bash
# one-time: create the Cloudflare Pages project + connect the git remote, then:
npm run deploy      # = astro build && wrangler pages deploy dist --project-name=meish-storefront
```

Decap CMS: flip `public/admin/config.yml` from `local_backend: true` to `git-gateway` once the
git remote + host exist, so the catalogue is editable from the browser.

## 4. Pre-publish gates (Jenni-approval)

Per the vault sitemap, hold these until approved: hero wording + CTA (`/`), pricing bands
(`/services`), Clara sample digest, aviation carrier-claim language, `/services/wayfinder`
(entire line `AWAITING_JENNI`), and final legal review of `/privacy`. `/services/wayfinder`
is intentionally **not built** yet.

## 5. Verify after deploy

- [ ] All routes 200 (old shop + new services/philosophy/privacy/contact)
- [ ] Checkout works in Stripe **test** mode, then a live smoke test
- [ ] Reserve form + Turnstile
- [ ] Emails deliver via Resend (not OUTBOX)

## Source of truth for copy

Vault: `03-Meish-Universe/Website/` (`00-Website-Sitemap.md` + `page-copy/`).
