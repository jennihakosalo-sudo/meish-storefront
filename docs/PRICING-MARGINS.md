# Pricing & Margins — working model

Status: **Real EU supplier costs now SOURCED (MEI-27, 2026-07-09) — final prices still FROZEN.**
Engineering sourced real, cited EU drop-ship costs (Appendix C) — the missing input the board
asked for. **No catalog price is changed yet:** the board's later **≤€20-per-product** rule
(see "Board decisions locked" below) collides with the poster/flagship, and that scope question
is unanswered. Prices in `src/data/catalog/*.json` stay put until (a) the €20-scope question is
answered and (b) the remaining small-run/pack quotes land. The sourced costs already answer the
board's core worry: at €20, posters and the metal sign fail on margin; Verse fits if drop-shipped;
themed paper packs are comfortably viable. Original draft model retained below for the trail.

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

Customer-paid shipping, charged at checkout (keeps it out of the margin math above). **Board
confirmed zone = EU** (FI kept as the domestic sub-rate). These are the flat customer-facing
rates we charge; each sits at or slightly above the supplier's real EU drop-ship cost (see
Appendix C), so shipping is margin-neutral-to-positive and never eats the product margin.

| Zone | Print tube/flat (Poster, Verse) | Metal sign | Paper-goods bulk run (250–500) |
|---|---|---|---|
| FI domestic | €6 | €9 | €9 |
| EU | €9 | €13 | €15 |
| Worldwide | *not enabled — EU only per board* | — | — |

Notes:
- **Trade printers bundle delivery into the run price** (Onlineprinters, Helloprint, BIZAY),
  so on paper-goods runs the €15 EU rate is mostly a customer-facing convenience charge, not a
  cost we carry — it's upside.
- A3 prints ship rolled in a tube, not as a flat mailer, so Verse uses the tube rate.
- If we later flip to supplier pass-through pricing (Helloprint API returns a live rate), swap
  these flats for the quoted rate at checkout. Flat rates are the safe launch default.

---

## Appendix C — Sourced EU supplier costs (MEI-27, 2026-07-09)

This is the real sourcing the board asked engineering to do. Costs are real, cited 2025–26 EU
market prices; where a supplier gates exact per-size cost behind a free account the figure is
**EST** off cited anchor prices. All EUR, ex-VAT (input VAT reclaimable if registered).

**Anchoring these against the ≤€20 rule, not the old €48/€24 draft.** At €20 retail the
drop-ship supplier-cost ceiling is **c_max = €9.95** (from the "€20-ceiling recompute" above);
a themed 2-person pack at €18 has a **€8.88** ceiling. Verdicts below are vs those numbers.

| # | Product | Best EU drop-ship supplier | Real unit cost | ≤€20 verdict |
|---|---|---|---:|---|
| 1 | Poster 50×70 | **Prodigi** enhanced matte | ~€10–14 EST | **FAILS ≤€20** (>€9.95) → keep premium >€20, or need a <€10 print source. *This is exactly the board's open question.* |
| 2 | Verse A3 giclée (200gsm fine-art) | **Prodigi** fine-art | ~€6–11 EST | **Fits €20 iff drop-ship + supplier ≤ €9.95.** Viable at the low end. Spec **200gsm fine-art**, not 300gsm cotton rag (~€10–14 breaches). |
| 3 | Metal sign 20×30 | none (Prodigi alu ~€19, US-only elsewhere) | ~€19+ | **FAILS hard.** No EU white-label under €9.95; real enamel/tin is bulk-stock MOQ ~100. Sourcing owned by **MEI-30** (metal-prints RFQ). |
| 4–6 | Paper goods → **themed packs** | Helloprint / Onlineprinters / BIZAY | see below | **Comfortably viable.** Board pivoted these to 2-person+ printable packs; per-unit trade costs below feed pack costing. |

**Paper-goods per-unit costs (trade runs — the floor for pack costing):** coaster **€0.054**
(BIZAY, qty 500) · menu card DL **€0.144** (Onlineprinters, qty 250) · placemat A3 **€0.211**
(Helloprint, qty 250, blind drop-ship + API). A 2-person themed pack (≈2 placemats + 2 coasters
+ 2 menu cards + napkins + bottle-belt) carries ~**€0.82** of printed-paper cost at trade rates —
so even with a heavy small-run multiplier and napkin/belt sourcing it sits far under the €8.88
pack ceiling. **Packs are the safe, high-margin core.** Open cost driver is the *small-run print
device/supplier* the board wants (trade MOQs of 250/500 don't fit consumer packs) — that quote is
the one number still missing for packs.

### Supplier shortlist (who to open accounts with)
- **Prodigi** — posters + Verse. White-label as standard, branded insert cards **no subscription / no MOQ**, real EU fulfilment. Best fit for the "our brand packaging, no plastic wrap" requirement.
- **Helloprint** — placemats / menu cards / pack paper goods. Full **blind white-label drop-ship + REST API**, reseller pricing.
- **BIZAY** (coasters) / **Onlineprinters** (menu cards) — cheapest EU trade runs; neutral packaging (tuck our printed insert into the carton at the run stage).
- Avoid: **Printful** (can't add pack-ins to wall-art-only orders), **Gelato** inserts (EU insert shipping limited to DE/SE/DK/FR + Gelato+ subscription), any US-only metal printer.

### What this leaves open (drives the disposition)
1. **The €20-scope question** — does ≤€20 cover *everything* (then poster + metal sign get repriced-above / cut) or only the retail table-setting SKUs (flagship + poster stay premium)? Raised to the board as a structured interaction. **Final prices are frozen until this is answered** — no point setting numbers that the scope decision would overturn.
2. **Metal sign** has no viable ≤€20 EU drop-ship path — folded into **MEI-30**'s metal-prints RFQ (in_review). At €20 it can't stay as-is; it needs the same scope call as the poster.
3. **Small-run pack quote** — the one missing supplier number for the packs model (consumer-sized runs, not 250/500 MOQ). Engineering to RFQ once pack composition is fixed by the scope answer.
4. **Sample QC** — the board's drop-ship gate: order one sample per SKU, pass QC, *then* point checkout at real suppliers. Human/board action, required before real money.
