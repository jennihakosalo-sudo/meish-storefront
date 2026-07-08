# Checkout, Stripe & order capture (MEI-4)

How the money path works, how to run it end to end, and the two decisions the
CEO/board still need to make before we can charge a card.

## The flow

```
shop/[slug]  ──Add to cart──▶  localStorage cart  ──▶  /cart
        (or the /design studio, once its "Order" hook is wired — see below)

/cart  ──POST /api/checkout──▶  Stripe Checkout Session  ──▶  hosted Stripe page
                                                                    │
                                              payment succeeds ──────┤
                                                                    ▼
        Stripe ──POST /api/stripe-webhook──▶  saveOrder()   (source of truth)
        buyer  ──GET  /api/order?session_id──▶  reconcile + show receipt (/success)
```

- **Prices are server-side.** `/api/checkout` ignores any amount from the
  browser and recomputes line items from `src/lib/pricing.ts`. The cart can
  never tamper with what is charged.
- **The design artifact travels with the order.** Each line's artifact (the
  buyer's words or a link to their exported proof) is stored in the Stripe
  Product metadata and copied onto the captured order.
- **Capture is idempotent** by Stripe session id, so the webhook and the
  success-page reconciliation can both persist the same order safely.

## Files

| File | Role |
|---|---|
| `src/lib/pricing.ts` | Machine prices (euro cents) keyed to catalogue slugs. **Placeholder prices — CEO to confirm.** |
| `src/lib/stripe.ts` | Stripe client + `orderFromSession()` mapping |
| `src/lib/orders.ts` | Order store (MVP = JSON files under `.data/orders`) |
| `src/pages/api/checkout.ts` | `POST` cart → Stripe Checkout Session |
| `src/pages/api/stripe-webhook.ts` | `POST` capture paid order (source of truth) |
| `src/pages/api/order.ts` | `GET` reconcile + read an order for the receipt |
| `src/scripts/cart.ts` | Client cart (localStorage), badge, checkout button |
| `src/pages/cart.astro`, `src/pages/success.astro` | Cart + receipt pages |

## Run it end to end locally (Stripe test mode)

1. `cp .env.example .env` and set `STRIPE_SECRET_KEY` (test key from the CEO).
2. `npm run dev` (serves the API routes).
3. In another terminal, forward webhooks and copy the printed `whsec_...` into
   `.env` as `STRIPE_WEBHOOK_SECRET`:
   `stripe listen --forward-to localhost:4321/api/stripe-webhook`
4. Open a product → **Add to cart** → **/cart** → **Proceed to checkout**.
5. Pay with Stripe's test card `4242 4242 4242 4242`, any future expiry/CVC.
6. You land on `/success` with a receipt, and a JSON order appears in
   `.data/orders/` — that is the "stored order end to end" deliverable.

## Open decisions (blockers for a live/deployed payment)

1. **Stripe test credentials** — needed from the CEO. Nothing charges without
   them; the code returns a clean `503` until `STRIPE_SECRET_KEY` is set.
2. **A serverless-capable host.** The interim host is surge.sh, which serves
   static files only and **cannot run `/api/*`**. The marketing/catalogue pages
   stay static (Astro `hybrid` prerenders them); only the three API routes need
   a server. Options, all with a generous free tier:
   - **Vercel** (`@astrojs/vercel`) — recommended; simplest Astro SSR story.
   - **Netlify** (`@astrojs/netlify`).
   - **Cloudflare Pages** + Pages Functions (`@astrojs/cloudflare`).
   Switching is a one-line adapter change in `astro.config.mjs` — the routes are
   standard `Request`/`Response` handlers and don't change.
3. **Final prices & quantity tiers** — `src/lib/pricing.ts` currently mirrors the
   "from €X" labels as placeholders. CEO to confirm real prices.

## Follow-ups (not blockers)

- Wire the `/design` studio's export/"Order" action to add the exported proof to
  the cart as the artifact (today the artifact is a text note / link entered on
  the product page). The cart API contract above is stable for this.
- Move the order store off the local filesystem to a hosted DB for production
  (re-implement the three functions in `src/lib/orders.ts`).
- Order notification email to the studio (belongs with MEI-5).
