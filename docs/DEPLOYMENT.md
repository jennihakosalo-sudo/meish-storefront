# Meish Printed — Deployment Plan (minimal)

**Goal:** one-command deploy of the static storefront to a free-tier host on
`meish.work`, with automatic per-branch preview deploys. Everything on free
tiers; paid needs flagged to the CEO before incurring.

## Host recommendation: Cloudflare Pages

Chosen over Vercel/Netlify (all acceptable, all free) because:

- **Unlimited bandwidth on the free tier** — matches the "cheap traffic spikes"
  requirement directly; a launch-day surge costs nothing.
- **Free preview deploy per branch/PR**, unlimited.
- **Free custom domain + DNS** for `meish.work` if the domain is on Cloudflare —
  simplest path to HTTPS and previews.
- **Pages Functions** available later for the reserve-interest serverless
  endpoint (MEI-21) without changing hosts.

Netlify is the equally-fine fallback (identical model; `_headers` file already
works there). Config committed: `wrangler.toml`, `public/_headers`.

## Build settings (whichever host)

| Setting | Value |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | 20+ (repo built on 24) |
| Install command | `npm install` |

## Standing up production (one-time, needs CEO/owner)

These steps need account + domain access the engineer doesn't currently hold —
**see "Access needed from CEO" below.**

1. Create a git remote (GitHub) and push this repo.
2. Cloudflare dashboard → **Pages → Create → Connect to Git** → select repo.
   Set build command `npm run build`, output `dist`. First deploy runs.
3. **Custom domain:** Pages project → Custom domains → add `meish.work` (and
   `www`). If `meish.work` DNS is on Cloudflare this is one click + auto-HTTPS.
4. **Preview deploys:** on by default — every non-production branch/PR gets a
   unique `*.pages.dev` preview URL automatically. No extra config.

## Ongoing workflow (once wired)

- Push to `main` → production deploy to `meish.work`.
- Open a branch/PR → automatic preview URL for review.
- One-command manual deploy from a machine with Cloudflare auth:
  `npm run deploy` (runs `astro build` + `wrangler pages deploy dist`).

## Access needed from CEO (blocks the *live* deploy only)

The repo is fully build- and deploy-ready; going live needs credentials/access
the Founding Engineer does not have:

1. **`meish.work` domain access** — registrar/DNS (ideally add the domain to a
   Cloudflare account) so we can point it at Pages and issue HTTPS.
2. **A host account** — a Cloudflare (or Netlify/Vercel) account, or an invite
   to an existing one, to create the Pages project and connect the repo.
3. **A git remote** — a GitHub repo (org or personal) to push to and connect for
   CI/preview deploys.

Everything above is **free tier**. No paid service is required for this MVP
foundation. First *likely* future paid items (flagged early, not needed now):
custom email/CAPTCHA add-ons for the reserve flow, a managed DB if we outgrow a
sheet, and Stripe for real payments later.

## Verification checklist (post-deploy)

- [ ] `https://meish.work` serves the homepage over HTTPS.
- [ ] A test branch produces a working preview URL.
- [ ] `/style` renders the design system; 404 page works.
- [ ] Lighthouse: performance & accessibility ≥ 95 (static + system fonts).
