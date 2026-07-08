# Pricing & Margins — working model

Status: **DRAFT / not yet validated with real supplier quotes.** The catalog prices below
are storefront placeholders I (engineering) set to make the store look right — they have
**not** been checked against real supplier + fulfilment costs. This doc exists so we lock in
real numbers before we take real money.

## Why the board is right to worry

The concern was: *"decent profit even after shipping, repacking and reshipping."*

A **repack-and-reship** model has three cost legs, not one:

1. Supplier prints the item → **inbound shipping** to us
2. We open, brand/repack → **repack labour + materials**
3. We ship to the customer → **outbound shipping**

That's **two shipments + handling** on every order. It's survivable on a €48 poster and
**fatal** on a €0.15 coaster. The single biggest lever is: can we **blind-drop-ship** (supplier
ships direct to the customer in our packaging) and delete legs 1 and 2 entirely?

## Per-order margin waterfall (template)

```
  Retail price (what customer pays)
– Supplier unit cost (print / manufacture)
– Inbound shipping to us        ← 0 if blind-drop-ship
– Repack materials + labour     ← 0 if blind-drop-ship
– Outbound shipping to customer
– Packaging / branded insert
– Payment fees (Stripe EU: ~1.5% + €0.25)
– Returns/reprint reserve (~5%)
= Gross profit  →  target ≥ 40% of retail
```

## First-pass estimates on current catalog (EU, placeholder costs — REPLACE with quotes)

| Product | Retail | Est. supplier | Est. outbound ship | Repack model verdict |
|---|---|---|---|---|
| Atelier poster 50×70 | €48 | €12–18 | €9–14 (tube) | OK direct; thin if repacked |
| Verse print 240gsm | €24 | €6–10 | €5–8 (flat/tube) | OK direct; tight if repacked |
| Enamel tin plate | €18 | €7–11 | €5–8 | Tight — needs cheap supplier |
| Menu card €0.30/unit | €0.30 | ? | €4–6/parcel | **Only works at MOQ** |
| Placemat €0.40/unit | €0.40 | ? | €4–6/parcel | **Only works at MOQ** |
| Coaster €0.15/unit | €0.15 | ? | €4–6/parcel | **Only works at MOQ** |

**Two hard conclusions already visible without any quotes:**

1. The small paper goods (coaster / menu card / placemat) **cannot** be sold per-unit at
   these prices — one parcel of shipping (~€4–6) exceeds the whole order value. They need a
   **minimum order quantity** (e.g. 50–100 units) or to be bundled, or they lose money on
   every sale.
2. Repack-and-reship should be the exception, not the default. Push suppliers for
   **blind/white-label drop-ship** so we pay shipping **once**, not twice.

## What I need from the board to turn this from a model into real numbers

- Do we already have supplier(s) lined up, or is sourcing still to be done?
- Can our supplier **blind-drop-ship** (their box, our label, straight to customer)?
- Target market / shipping zones (EU-only? worldwide?) — sets the shipping table.
- Any brand requirement that *forces* repacking (custom box, insert card)?

Once I have supplier quotes + a shipping table I'll plug them in here and set final,
margin-validated prices in `src/data/catalog/*.json`.
