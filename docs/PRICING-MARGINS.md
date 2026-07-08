# Pricing & Margins — working model

Status: **DRAFT / not yet validated with real supplier quotes.** The catalog prices below
are storefront placeholders I (engineering) set to make the store look right — they have
**not** been checked against real supplier + fulfilment costs. This doc exists so we lock in
real numbers before we take real money.

## Board decisions locked — 2026-07-08 (MEI-27 interaction 45ddd82c + follow-up comment)

The board answered the 5 sourcing questions and added product direction. Locked:

1. **Price ceiling: every product ≤ €20 retail.** ⚠ This overturns the current catalog — the
   Atelier poster is €48 and Verse print €24. See "€20-ceiling recompute" below; the poster
   and the Master-Brief book+pencils+plate bundle do **not** fit ≤€20 at 40% margin, so that
   collision is escalated back to the board (open question, not silently repriced).
2. **Market / zones: EU only** (no worldwide yet). Engineering recommendation for launch
   sequence: **Finland first** (domestic — Finnish brand, EUR, cheapest/fastest shipping,
   easiest returns + GDPR + drop-ship QC on home turf), then **Germany + Netherlands** (largest
   EU e-commerce volume, strong cross-border logistics, English-friendly for the humour-forward
   copy), then broader Eurozone. All inside the single market → one currency, no customs.
3. **Drop-ship: allowed *after* a quality check**, and only if the supplier will ship in **our
   brand packaging** (blind-drop-ship, our box/label). **No all-plastic "China wrap".** Brand
   packaging is a hard requirement (repack_required = yes) — so the target is *supplier
   drop-ships using our branded materials*, not us repacking.
4. **Small paper goods: MOQ is mandatory OR move to small-quantity printing.** Board's chosen
   direction: sell **themed printable packs "for 2 persons and up"** (e.g. a Halloween dinner
   pack: placemats + coasters + menu cards + napkins + bottle belts), not per-unit. Packs use
   **themed templates** and accept **per-order customization requests** ("more skeletons, no
   cats") — the supplier honours these to our quality standard. This replaces the 250/500-unit
   MOQ model with consumer-sized packs and needs a small-run print device/supplier.
5. **Real per-unit supplier costs: still none** (have_quotes = no). Sourcing is engineering's
   to drive → RFQs are in flight in **MEI-29 / MEI-30**. Final ≤€20 prices land when quotes
   return and are checked against the €20 c_max table below.

### €20-ceiling recompute (same formula, R = €20)

`c_max = (0.535·R − 0.25 − S − P)/N`, P = €0.50 branded insert.

| Scenario | c_max (max supplier unit cost for 40% GM) |
|---|---:|
| Blind-drop-ship, S = 0 | **€9.95** |
| We absorb one parcel, S ≈ €5 | **€4.95** ⚠ |
| Themed 2-person pack @ €18, drop-ship | **€8.88** |

**Implications at €20:**
- **Poster** (est. supplier €12–18) **fails** ≤€20 even drop-shipped → keep it >€20 as a
  premium exception, drop it, or find a <€10 print source. **Board decision needed.**
- **Verse print** (€6–10) fits at €20 **only if drop-shipped** and supplier ≤ €9.95.
- **Enamel plate** (€7–11) borderline; needs supplier ≤ €9.95 **and** drop-ship.
- **Themed packs** are viable at €12–20 **only** with small-run printing + drop-ship.
- **Flagship book + pencils + metal plate** (Master Brief, MEI-6) cannot be ≤€20 at 40% GM —
  confirm the €20 ceiling applies to **retail table-setting SKUs**, not the flagship editions.

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

---

## Appendix A — Cost ceilings (computed, no quotes needed) — added MEI-27

Two things changed the picture since the draft above:

- The catalog **already carries `minQuantity`** on the paper goods (coaster 500, menu card
  250, placemat 250). So they are **not** sold per-unit — the smallest coaster order is
  500 × €0.15 = **€75**, which absorbs one €4–6 parcel at ~7%. **Finding #1 is already
  mitigated in the schema.** The open variable is purely supplier print cost.

Instead of asking the board open-ended questions, we can hand them a **pass/fail test**: the
**maximum supplier unit cost** at which each product still clears a **40% gross margin**.
Model per order of N = MOQ units:

```
R = N × retail_unit
require  R − N·c − S − P − (1.5%R + €0.25) − 5%R  ≥  0.40 R
  ⇒  c_max = (0.535·R − 0.25 − S − P) / N
     S = outbound parcel we absorb   P = branded insert (€0.50)
```

| Product | Retail | MOQ | Order € | **c_max (blind-drop-ship, S=0)** | **c_max (we absorb 1 parcel)** |
|---|---:|---:|---:|---:|---:|
| Atelier poster 50×70 | €48 | 1 | €48 | **€25.43** | €12.93 (tube) |
| Verse print 240gsm | €24 | 1 | €24 | **€12.59** | **€4.09** ⚠ |
| Enamel tin plate | €18 | 1 | €18 | **€9.38** | **€2.88** ⚠ |
| Menu card | €0.30 | 250 | €75 | **€0.160** | €0.138 |
| Table placemat | €0.40 | 250 | €100 | **€0.213** | €0.191 |
| Coaster | €0.15 | 500 | €75 | **€0.080** | €0.069 |

**The real margin cliff is the mid-price items, not the paper goods.** Draft estimates put
Verse supply at €6–10 and Enamel at €7–11 — both **blow straight through** the €4.09 / €2.88
ceilings the moment we repack-and-reship. Conclusion sharpened:

1. **Blind-drop-ship is mandatory for Verse and Enamel**, not optional. Repacked, they lose
   money at any realistic print cost. If a supplier *cannot* drop-ship these two, we either
   raise their price or drop them.
2. **Paper goods are fine on shipping** thanks to MOQ — they only need a print cost under the
   c_max above (coaster ≤ 8¢ is the tight one; achievable in 500-runs).
3. **Poster survives either way** (ceiling €12.93 even absorbing a tube), so it's the safe
   flagship.

### Decision-ready ask for the board
For each product, one question: **is the real supplier unit cost at or below the drop-ship
c_max?** If yes → price stands. If a supplier can't drop-ship Verse/Enamel → those two need a
price bump or get cut. Everything else in `src/data/catalog/*.json` is validated the moment a
quote lands next to this table.

## Appendix B — Shipping table skeleton (fill zone rates on board answer)

Customer-paid shipping, charged at checkout (keeps it out of the margin math above). Rates TBD
once the board confirms zones; structure is ready:

| Zone | Small parcel (paper goods, ≤2 kg) | Tube (poster) | Flat/board (print, tin) |
|---|---|---|---|
| FI domestic | € _ | € _ | € _ |
| EU | € _ | € _ | € _ |
| Worldwide (if enabled) | € _ | € _ | € _ |

Blocked only on: **which zones we sell to**, and whether the supplier's drop-ship rate is what
we pass through or we set our own flat rate.
