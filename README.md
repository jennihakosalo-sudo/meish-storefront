# Meish Printed — Storefront

An editorial, static-first storefront for a boutique print studio. Built with
**Astro** (SSG). This repo is the technical foundation for the MVP (issue
MEI-17); storefront pages, the product model, and the reserve-interest flow
build on top of it.

## Why Astro (stack rationale)

The MVP is a beautiful, content-driven shop that must be near-free to host,
resilient to launch-day traffic spikes, and easy for a non-technical admin to
edit. Astro renders every page to plain static HTML with zero JavaScript by
default — that gives us the fast, editorial page loads the brand needs, hosting
that stays on free tiers, and spike resilience essentially for free (static
files off a CDN). It stays flexible: we can drop in a git-based/headless CMS for
product content, add interactive "islands" only where needed (e.g. the reserve
form), and switch a single route to a serverless function when we need one — all
without leaving the framework. Next.js static export was the alternative, but it
carries a heavier React runtime and build model than this mostly-static shop
needs. **Decision: Astro, static output, add host adapter later only for the
one dynamic route.**

## Quick start

```bash
npm install      # install deps (Astro + self-hosted variable fonts)
npm run dev      # local dev server at http://localhost:4321
npm run build    # static build → dist/
npm run preview  # serve the built dist/ locally
```

## Project structure

```
src/
  styles/tokens.css   ← design system: color, type, spacing (source of truth)
  styles/global.css   ← base styles + editorial primitives (.button, .eyebrow…)
  layouts/Base.astro  ← page shell (head, header, footer, skip-link)
  components/          ← Header, Footer
  pages/              ← routes: / , /shop , /about , /reserve , /style , 404
public/               ← static assets, favicon, _headers
docs/                 ← DESIGN-SYSTEM.md, DEPLOYMENT.md
```

- **`/style`** renders the living design system (color, type, spacing, buttons).
- Placeholder pages (`/shop`, `/reserve`) are routing skeletons the later MVP
  tasks fill in. See `docs/DESIGN-SYSTEM.md` and `docs/DEPLOYMENT.md`.

## Design system

Warm paper background, ink-black type, a clay accent; **Fraunces** (display
serif) over **Inter** (body sans). Never hard-code a color/size/spacing value in
a component — reference the tokens in `src/styles/tokens.css`. Full reference in
`docs/DESIGN-SYSTEM.md`.

## Deploy

Static build to a free-tier host (recommended **Cloudflare Pages**) on
`meish.work` with per-branch preview deploys. Full runbook in
`docs/DEPLOYMENT.md`.
