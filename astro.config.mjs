// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// Hybrid rendering. Every marketing/catalogue page still prerenders to plain
// HTML at build time (free, fast, cache-friendly). Only the money path opts
// into server rendering via `export const prerender = false`:
//   - POST /api/checkout        → create a Stripe Checkout Session
//   - POST /api/stripe-webhook  → capture the paid order (source of truth)
//   - GET  /api/order           → reconcile/read an order on the success page
//
// The Node adapter is deliberately host-neutral: the API routes are standard
// Web `Request`/`Response` handlers, so moving to Vercel/Cloudflare later is a
// one-line adapter swap (see docs/CHECKOUT.md) — no route changes.
export default defineConfig({
  site: 'https://meish.work',
  output: 'hybrid',
  adapter: node({ mode: 'standalone' }),
  build: {
    format: 'directory',
  },
  trailingSlash: 'ignore',
});
