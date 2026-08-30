# Meish Website — Information Architecture (implementation reference)

**Status:** REFERENCE ONLY. Do not implement the full Universe ontology, Elementary System UI, product-development pathway, or new catalogue pages from this file alone.  
**Last captured:** 2026-08-28  
**Related:** `docs/meish-eheys.html` (eheys / no dead ends), `src/data/meish-offers.ts` (current offer data), Hatchling public nav.

This document extracts durable rules the **public website** must respect. Full research architecture and product-development process stay out of scope until explicitly tasked.

---

## 1. Large → small (human presentation)

Progressive disclosure, not a forced questionnaire. The person may skip, reverse, or enter by product name.

```
MEISH UNIVERSE
  → WHO? (Business / Individual — public top level)
  → WHAT DO YOU NEED? (outcome in plain language)
  → CONTEXT (filter / metadata — not a duplicate product)
  → TYPE (product, service, tool, …)
  → DEPTH (how far Meish enters the situation)
  → SPECIFIC MEISH ITEM
  → ELEMENTS INSIDE IT
  → RELATED NEXT STEP
```

**Current Hatchling (live):** Universe → doors (Business, For You, Tools, Gifts) → named offer or honest empty state. Do not add extra homepage questions for Context / Type / Depth.

**Later views of the same data (not separate catalogues):** Star Map and Table of Elements. Same underlying records; different presentation.

---

## 2. Facet model (underlying system is graph / faceted)

Do not force people or products into one exclusive tree category.

| Facet | Public role | Rule |
|--------|-------------|------|
| **Who** | Top-level: Business / Individual | Secondary (team, family, customer, …) = metadata only |
| **Need** | Outcome language | Enter by need without knowing product name |
| **Context** | Filter / modifier | Do not clone the same item for each context |
| **Type** | Explicit badge | product, service, tool, method, process, artefact, resource, … — never vague “solution” |
| **Depth** | Entry depth | Lite → Guided → Practical → System → Embedded / Whole-experience — meaning, not visual symmetry |
| **Elements** | Composable seal | Reusable building blocks; one product may use several |
| **Status** | Marker | Public, Gamma, Pilot, Limited, not-published-yet |
| **Next** | Graph edge | Related products / next step — no dead ends |

One product may belong to several contexts and audiences. One Element may appear in many products.

---

## 3. Meish Elements and colour

- Elements are **compositional**, not one decorative colour per product.
- A product seal may show **1–5** Element colours; the same colour may recur across many products.
- Colour is **semantic** (Element family), not branding decoration.
- Do not invent Element names for the public site until sealed in delivery material.

---

## 4. Product information — shared source of truth

- One shared source of truth for public offers (today: `src/data/meish-offers.ts`; extend carefully, do not fork).
- Do **not** invent products, prices, promises, durations, or deliverables.
- Every public product must show, in consistent card positions:
  1. Name  
  2. Seal / Elements (when ready)  
  3. Status  
  4. Type  
  5. Who it is for  
  6. When it is useful (human situation)  
  7. What the customer gets  
  8. What is included  
  9. Customer input  
  10. Meish input (human / AI / mixed — not “AI-powered”)  
  11. Expected benefit (concrete)  
  12. Price (always visible)  
  13. Time / duration  
  14. Gamma marker if applicable  
  15. Related Elements  
  16. Related products / next step  
  17. CTA  

### Pricing state (never silently empty)

Use one of: `€0` | `€X` | `from €X` | `Gamma Test €X` | `request a quote` | `price to be confirmed`.

Always state VAT when a euro price is shown (Finland: 25.5% when verified).

### Gamma rule

- **Gamma is a STATUS**, not part of the product name.
- Correct: **Possibility Map** + separate Gamma Test Phase / Gamma Test Price marker.
- Incorrect: “Gamma Test / Possibility Map” as the title.
- Do not call Fit Check “AI Fit Check”.

### Audience / Entities

- Do **not** publish Entities, Moona, Meish Alpha, or local-family Entity offers on Hatchling unless explicitly approved for public.
- Workshops and other unverified lines stay off public cards until pricing and scope are confirmed.

---

## 5. Product verification ledger (vs user-required list)

| Item | Verification | Pricing state for site | Notes |
|------|--------------|------------------------|--------|
| 20-minute Fit Check | VERIFIED / PUBLIC | €0 | Individuals + businesses; NOW → DESIRED FUTURE → POSSIBLE ROUTE |
| Possibility Map | GAMMA / PILOT | Gamma Test €590 + VAT 25.5% (normal €950 + VAT) | Name first; Gamma separate |
| Friction Removal | VERIFIED (scope) / PUBLIC ladder | from €1,899 + VAT 25.5% | Targets ≠ guarantees; 10-day satisfaction if verified |
| Build with Meish | UNKNOWN / NEEDS CONFIRMATION | Site currently shows €790 — treat as **needs confirmation** before trusting | Prefer request a quote until re-verified |
| A Week with Meish | UNKNOWN / NEEDS CONFIRMATION | Site currently “From 7,500 €” — **needs confirmation** | Prefer request a quote if not re-verified |
| Human Experience Review | VERIFIED as concept | request a quote / after Fit Check | Lenses internal until published carefully |
| Workshops (e.g. Tekoäly sujuvasti käyttöön) | INTERNAL / NOT READY for Hatchling | price to be confirmed | €350 known as advance only — not total |
| Moona / Local Family Entity | INTERNAL / NOT READY | — | Do not publish on Hatchling |

---

## 6. Navigation and UX principles (website must respect)

Aligned with `docs/meish-eheys.html`:

1. Person always knows **where they are**.
2. One clear **next act** — no dead ends; empty states (e.g. Gifts) point to contact or Fit Check.
3. No accidental loops; links go to real routes.
4. Customer need not learn Meish jargon before finding help — use outcome language.
5. Prefer recognition and choice over rigid segmentation.
6. At most ~two disclosure levels in UI; extra facets = filters, not extra screens.
7. Information scent: labels must match the destination page.
8. Reversible navigation: change Who / Need / viewpoint without being trapped.
9. Honest empty cells / unpublished products — do not invent filler.
10. Extensible: new products add facets; they do not force a new exclusive tree.

---

## 7. Explicitly out of scope for website implementation now

- Full Elementary System / periodic-table UI  
- Full product-development pathway, AI prompt library, multimodal capture  
- Expanding the public catalogue  
- Collectible-card UI redesign beyond fixing accuracy and consistency  
- Speculative products or Entity pages  

When product copy changes: record old → new → why → date (living process). Do not silently overwrite history in docs.

---

## 8. Minimum product card template (content fields)

Use when adding or editing a public offer (editable checklist; not a requirement to build a CMS form now):

```
NAME / WORKING NAME / TYPE / STATUS
WHO FOR / WHO NOT FOR / WHEN USEFUL
PROBLEM OR OPPORTUNITY / DESIRED AFTERWARDS / CORE PROMISE
CUSTOMER RECEIVES / INCLUDED / NOT INCLUDED
CUSTOMER INPUT / MEISH HUMAN / AI OR AUTOMATION
DURATION / DELIVERY FORMAT
PRICE / VAT / PRICING STATE / GUARANTEE
ELEMENTS / METHODS / LENSES
RELATED PRODUCTS / LOGICAL NEXT STEP
RISKS / EVIDENCE / GAMMA LEARNING QUESTIONS
LAST REVIEWED / OWNER
```
