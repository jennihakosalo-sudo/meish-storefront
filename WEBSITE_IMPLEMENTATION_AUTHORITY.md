# Meish.work — website implementation authority

**Status:** Development only (`meish-work-public`). Not production.  
**Repo:** `meish-storefront`  
**Date:** 2026-08-31  
**Rule:** Implement against this file. Do not treat filenames, old commits, or unused components as visual or product authority.

Do not merge to `main` or deploy production without Jenni.

---

## 1. Git and hosts

| Item | Authority |
| --- | --- |
| Canonical repo | `jennihakosalo-sudo/meish-storefront` |
| Development branch | `meish-work-public` → `origin/meish-work-public` |
| Production Git branch | `main` (`cb14e40` as of this lock). Do not merge without approval. |
| Live site | Vercel `meish-storefront`. Live may not equal Git `main`. Do not overwrite. |
| Recoverable checkpoint | `4628e95` — working-tree snapshot, **not** visual canon |

---

## 2. Public content (customer-facing)

**North Star copy:** Human experience is our North Star.  
**Principle:** Design for the universe. Do not make the visitor learn the universe.

**Public doors (exact labels):**

1. Meish & Your Business  
2. Meish & You  
3. Tools  
4. Gifts for You  

**Contact:** `moona.m@meish.work`  
**Languages:** English and Finnish on the public entrance.

**Fit Check names (never “20-minute Fit Check” alone):**

- 20-minute Meish & You Fit Check  
- 20-minute Meish & Your Business Fit Check  

Fit Check is fallback, not the homepage hero product.

**Do not publish internally:** F1–F7, “7 Facet System”, Clarity–Joy/Expansion grid labels, “7-facet Meish Diamond” as a product name.

**Do not build for this launch:** full Meish Table of Elements as a public product or navigation destination.

---

## 3. Products and prices (locked)

Do not change prices. Do not invent products.

| Offer | Public status | Price |
| --- | --- | --- |
| Possibility Map (Gamma Test Phase) | Primary | €590 + VAT 25.5% (regular €950 + VAT 25.5%) |
| Build with Meish | Secondary | €790 + VAT 25.5% |
| Meish Friction Removal | Secondary | from €1,899 + VAT 25.5% |
| Human Experience Review | Secondary | Scope after conversation / named Fit Check |
| A Week with Meish | Secondary | from €7,500 + VAT 25.5% |
| Clarity Starter (PDF) | Gift | Free |
| Fit Checks (contextual names) | Fallback | €0 · 20 min |

**Not Phase 1 public offers:** Put AI to Work, AI assistant product, Treasure/shop as nav, Clara hotel SKUs, Table of Elements.

**Known conflict (label, do not silently pick):** vault 14-day / AI-SaaS list vs storefront 30 days, three routes, 5 business days. Current **website** copy uses 30 days + 5 business days. Changing that is a canon decision.

---

## 4. MEISH DIAMOND

**Public name:** MEISH DIAMOND.  
**Not a name:** “7-facet Meish Diamond”. Seven-part structure is an internal construction rule.

**MEISH PRODUCT SEAL** is a compositional, product-specific form. Do not substitute it for the public diamond.

**Look/feel references** (do not embed on pages):

- `public/brand/reference/meish-diamond-7-facet-board-2026-08-31.jpg`
- `public/brand/reference/meish-crystal-family-grid-2026-08-31.jpg`
- `public/brand/reference/meish-diamond-clear-studio-2026-08-31.jpg`
- `public/brand/reference/meish-diamond-clear-glass-2026-08-31.jpg`
- `public/brand/reference/meish-visual-system-board.jpg`

**Current homepage implementation (checkpoint, not approved canon):**  
`/brand/meish-diamond-board-hero-720.png` in `MeishUniverseScene.astro`.

**Not authority just because the filename contains diamond / Meish / hero / intensive / universe:**

- `meish-diamond-universe.jpg`
- `meish-diamond-intensive.png` / `-720.png`
- `meish-diamond-light.png` / `meish-diamond-transparent.png` (door bands)
- SVG `MeishDiamond` / `MeishStar` / `MeishGem`
- `UniverseHero.astro` (unused)

**Open:** Jenni must approve which **rendered** diamond is public canon.

---

## 5. Typography

**System:** 2 families, 3 roles.

1. Display serif — major editorial/brand headings (`--font-display`)  
2. Sans medium/semibold — UI, labels, navigation, metadata  
3. Sans regular/book — body (`--font-body`)

**Stand-in until ATHENA files exist:** Bodoni Moda (display) + Roboto (sans).  
**Forbidden on homepage:** romantic/decorative italic as brand treatment.

**Do not look like:** wellness branding, wedding stationery, fantasy gaming, generic SaaS.

**Same system later:** website, Meish Table of Elements, print, downloads. Do not invent a fourth family for launch.

**Open:** new webfont files / ATHENA activation = visual approval.

---

## 6. Colours

**Mineral palette** (`src/styles/tokens.css`):

| Token | Hex |
| --- | --- |
| Deep space | `#0B1020` |
| Amethyst | `#6A5ACD` |
| Fluorite | `#00C3D6` |
| Larvikite | `#6F87A8` |
| Gold | `#F7C873` |
| Coral | `#FF6B6B` |
| Pink quartz | `#F6B8E0` |
| Opal | `#EAF6FF` |

**Homepage surfaces in current implementation:** hero `#081020`; dark bands `#050510`; pearl `#f7f3ea` / `#efe9dc`.  
These are implementation, not a new palette. Do not invent extra brand colours.

---

## 7. Table of Elements / print / downloads

| Surface | Compatibility now |
| --- | --- |
| Table of Elements | Use same type roles + mineral palette later. **Do not build the table for website launch.** |
| Print / PDF | Same 2 families / 3 roles. Clarity Starter remains the public gift. |
| Door-band / print diamonds | Must match approved MEISH DIAMOND after visual approval — not leftover PNGs. |

---

## 8. Homepage acceptance (implementation)

Must be true after render:

- Nav and hero doors use the four public door names.  
- Possibility Map is the featured paid offer at locked Gamma price.  
- Fit Check uses a full contextual name.  
- No invented products.  
- No F1–F7 or “7-facet” naming.  
- No romantic italic on hero North Star.  
- Hero image is inspected as pixels, not trusted by filename.  
- Desktop and mobile remain readable; doors remain tappable.

**Still open (Jenni):** hero H1 “Universe” vs “do not make the visitor learn the universe”; which diamond asset is canon; ATHENA vs stand-in.

---

## 9. Homepage audit — 2026-08-31

| Check | Result |
| --- | --- |
| Four public doors | Pass (nav, hero, pearl row) |
| Possibility Map €590 + VAT 25.5% | Pass |
| Contextual Fit Check on homepage | Pass (business name) |
| Generic “20-minute Fit Check” on homepage | Pass (absent) |
| Invented “Put AI to Work” | Pass (absent) |
| Romantic italic on hero | Pass (`font-style: normal`) |
| Duplicate “Should we Meish this?” CTAs | Fixed (one CTA kept) |
| Homepage header nav hidden on mobile | Fixed (nav wraps; no hamburger invent) |
| Door-band leftover diamonds on inner pages | Open — visual, not this pass |
| Hero H1 “Universe” | Open — content decision |
| Hero PNG as canon | Open — visual approval |

---

*Implement mismatches against this file. Do not promote hypotheses into canon.*
