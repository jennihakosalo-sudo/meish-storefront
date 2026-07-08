# Fulfillment — print-on-demand integration (MEI-5)

Closes the **design → pay → fulfilled** loop: once an order is paid, it's routed
to a print-on-demand supplier with the print file, and its status is tracked
back to the customer by email and on the order page.

## Provider choice — Gelato

Evaluated Printful, Printify and Gelato against what Meish Printed actually
sells (posters, quote prints, cards, placemats — **paper goods**, EU customers):

| | Gelato | Printful | Printify |
|---|---|---|---|
| Paper goods (posters/cards/stationery) | ✅ core strength | ⚠️ secondary to apparel | ✅ via partners |
| EU local production (cost + speed) | ✅ 140+ sites, prints in-region | ✅ EU sites | ⚠️ varies by partner |
| Single clean Order API + webhooks | ✅ | ✅ | ✅ |
| Consistent quality (own/vetted network) | ✅ | ✅ (own) | ⚠️ marketplace variance |

**Chosen: Gelato.** For an EU studio shipping paper goods, local in-region
production is the biggest lever on shipping cost and delivery time, and Gelato's
paper catalogue is first-class rather than an apparel afterthought. Printful is a
close second and the code is provider-agnostic, so switching is a one-file change
in `src/lib/fulfillment.ts` (swap the request builder + submit call); nothing
else in the app talks to a provider.

## How it works

```
paid order (Stripe webhook OR success-page reconcile)
   └─► onOrderPaid()                     src/lib/order-flow.ts
         ├─ saveOrder()                  persist (idempotent by id)
         ├─ routeOrderToFulfillment()    src/lib/fulfillment.ts
         │     ├─ resolve print file + Gelato productUid per line
         │     ├─ build the Gelato v4 order request
         │     └─ submit → Gelato  (or DRY-RUN capture, keyless)
         └─ email: customer confirmation + studio routing summary  (once)

provider status update
   └─► POST /api/fulfillment-webhook      → applyFulfillmentUpdate()
         ├─ map Gelato fulfillmentStatus → our status, store it + tracking
         └─ email the customer on production / shipped / delivered / canceled
```

The customer sees status on `/success` (the order page) and in the milestone
emails. Fulfillment state lives on the order (`order.fulfillment`), see
`src/lib/orders.ts`.

### Status model

`not_submitted → submitted → in_production → shipped → delivered`, plus
`needs_artwork` (can't auto-route yet — studio produces the file / places by
hand), `canceled`, and `failed` (provider submission error, needs a human).

## Keyless-degrade (how it's proven with no secrets)

Exactly like Stripe (`docs/CHECKOUT.md`) and email (MEI-20):

- **`GELATO_API_KEY` set** → orders are submitted to Gelato for real.
- **unset** → **DRY-RUN**: the exact request we'd POST is written to
  `.data/fulfillment/<orderId>.json` and a synthetic `dry_<orderId>` id is
  returned. Status emails degrade to the `.data/outbox` capture (no `RESEND_API_KEY`).

### Local proof

`npm run dev`, then `GET /api/dev-fulfillment-check` (DEV-only; 404s in a
production build). It runs the real `onOrderPaid` path on synthetic paid orders
and exercises, end to end:

1. **Auto-route** — a line with a print-file URL + mapped product → a Gelato
   request captured to `.data/fulfillment/`, status `submitted`, customer
   confirmation + studio email in `.data/outbox/`.
2. **Status webhook** — a simulated `shipped` update → status + tracking stored,
   "on its way" email to the customer.
3. **Idempotency** — re-running capture does **not** re-submit or re-email.
4. **`needs_artwork`** — a note-only line (no file URL) routes to the studio
   fallback instead of erroring.

Verified 2026-07-09: all four pass.

## The print-file gap (depends on MEI-24)

Full automation needs a **print-ready file URL** per line. Today the line item's
`artifact` is free text or a link (the `/design` studio → cart handoff that
attaches a real exported file is **MEI-24**). So:

- artifact is an `https://…` URL → used as the print file, order auto-routes.
- artifact is a note → order is `needs_artwork`; the studio produces/uploads the
  file and places the Gelato order (the routing summary email flags this).

When MEI-24 lands a hosted file URL in the cart, orders auto-route with no other
change here.

## Go-live checklist (env only — no code change)

Blocked on a serverless host (**MEI-23**) like the rest of the money path; the
API routes can't run on surge.sh. Once hosted:

1. `GELATO_API_KEY` — from the Gelato dashboard (API).
2. Confirm the `DEFAULT_SKU_MAP` productUids in `src/lib/fulfillment.ts` against
   the studio's Gelato catalogue (or override via `FULFILLMENT_SKU_MAP`). **A
   wrong UID prints the wrong product** — verify with one sample order.
3. `FULFILLMENT_WEBHOOK_SECRET` — set it, and configure the Gelato webhook to
   send `order_status_updated` to `POST /api/fulfillment-webhook` with the
   `x-fulfillment-secret` header set to the same value. The route fails **closed**
   without it.
4. `RESEND_API_KEY` + verified `RESERVE_FROM_EMAIL` domain → real status emails.

## Production notes

- Orders (with fulfillment state) use the same MVP file store as MEI-4; move it
  to a hosted DB by re-implementing `src/lib/orders.ts` (interface unchanged).
- Shipping address is now collected at checkout (`shipping_address_collection`
  in `src/pages/api/checkout.ts`); `SHIP_TO_COUNTRIES` is the launch destination
  set — widen as the studio confirms markets.
