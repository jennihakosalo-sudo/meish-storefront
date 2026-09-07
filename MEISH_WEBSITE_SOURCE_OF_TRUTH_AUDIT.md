# MEISH WEBSITE — SOURCE OF TRUTH AUDIT

**Date:** 2026-08-31  
**Purpose:** Compare accessible Meish sources before any further website visual or copy revision.  
**Status:** READ-ONLY AUDIT. Preview is **not approved**. No redesign in this file.  
**Rule:** Newest-looking file is not automatically correct. Later dated corrections can supersede earlier ones. Conflicts are labelled, not silently resolved.

Classification used: CURRENT CANON · CURRENT STRONG DIRECTION · CURRENT PRODUCT · PRODUCT HYPOTHESIS · METHOD · TOOL · PROCESS · PHILOSOPHY · VISUAL SYSTEM · CUSTOMER CASE · OLD VERSION · SUPERSEDED · CONFLICT · UNKNOWN

---

## 0. Sources inspected

### A. Current website repo (`meish-storefront`)

| Path | Class | Note |
|------|--------|------|
| `src/pages/index.astro` | CURRENT IMPLEMENTATION (uncommitted) | Homepage being previewed; not approved |
| `src/components/MeishUniverseScene.astro` | CURRENT IMPLEMENTATION | Hero; italic display treatment; Intensive diamond |
| `src/data/meish-offers.ts` | CURRENT PRODUCT (site data) | Prices aligned with 2026-08-18 offer lock |
| `src/data/hatchling-nav.ts` | CURRENT IMPLEMENTATION | Doors + Fit Check mailto |
| `src/pages/for-business.astro`, `for-you.astro`, `tools.astro`, `gifts.astro` | CURRENT IMPLEMENTATION | Light-launch doors |
| `docs/MEISH-WEBSITE-INFORMATION-ARCHITECTURE.md` | CURRENT STRONG DIRECTION | 2026-08-28; Table of Elements later, not launch |
| `docs/CONTENT.md`, `DESIGN-SYSTEM.md`, `GO-LIVE.md`, `DEPLOYMENT.md` | MIXED / OLD VERSION | Printed-shop and Cloudflare history |
| `BRAND_ASSET_LOCK.md` + `scripts/check-brand-assets.mjs` | VISUAL SYSTEM (locked file) | Locks `meish-diamond-intensive.png` — **Jenni now rejects this diamond for public site** |
| `public/brand/*` | VISUAL SYSTEM | Multiple diamonds; Intensive locked; light/transparent variants |
| `UniverseHero.astro` | OLD VERSION | Unused; outdated door labels |
| `docs/meish-eheys.html` | METHOD / PROCESS | No-dead-ends / eheys |

### B. Obsidian vault (`/Users/jennihakosalo/Obsidian/10 miljoonan exit`) — accessible

| Path | Class | Note |
|------|--------|------|
| `Meish Universe Source of Truth.md` | CURRENT CANON (names, structure, entities) | Wins on structure/names; 2026-08-14 last version note |
| `MEISH_CURSOR_MASTER_CONTEXT.md` | CURRENT CANON (content/design) | 2026-08-14; SoT wins if conflict on names |
| `06-Assets/.../MEISH-UNIVERSE-STRUCTURE-ONE-PAGER.md` | CURRENT STRONG DIRECTION | 2026-08-30; Hatchling + Table naming |
| `03-Meish-Universe/Brand/MEISH-HATCHLING-LAUNCH-SCOPE.md` | CURRENT STRONG DIRECTION (awaiting approval) | 2026-08-24 + 08-26 addendum |
| `03-Meish-Universe/Brand/MEISH-WEBSITE-INTERACTION-CANON.md` | CURRENT CANON (interaction) | Journey, no dead ends, North Star |
| `03-Meish-Universe/Brand/MEISH-WEBSITE-HANDOFF-2026-08-26.md` | CURRENT STRONG DIRECTION | Conflicts with Hatchling on CTA name |
| `03-Meish-Universe/Brand/MEISH_HYPERAGENT_WEBSITE_EXPORT_AUDIT.md` | SUPERSEDED / CONFLICT log | Do not treat Hyperagent as canon |
| `03-Meish-Universe/Brand/Philosophy/Meish-Human-Experience-Philosophy.md` | PHILOSOPHY | Canonical synthesis |
| `03-Meish-Universe/Brand/Philosophy/Meish-Core-Design-Principles.md` | PHILOSOPHY | Outcome First, Recognition Before Creation |
| `03-Meish-Universe/Brand/Philosophy/Meish-Outcome-First.md` | PHILOSOPHY | Customer buys outcome |
| `03-Meish-Universe/Method/Naming-and-Language/Meish-Glossary-and-Terms.md` | CURRENT CANON (terms) | Fit Check; Signal; object types |
| `03-Meish-Universe/Method/MEISH-ELEMENTS/MEISH_ELEMENTS_FRAMEWORK.md` | METHOD | Thinking method |
| `03-Meish-Universe/Method/MEISH-ELEMENTS/MEISH-ELEMENTARY-TABLE-AND-REGISTRY.md` | METHOD / BEING DEVELOPED | Not homepage taxonomy |
| `04-Projects/MEISH Business Development/MEISH-AI-OFFERS.md` | CURRENT PRODUCT | Jenni lock 2026-08-18 |
| `04-Projects/MEISH Business Development/ASIAKASPUTKI.md` | PROCESS | Active sell: Possibility Map Gamma |
| `04-Projects/MEISH Business Development/MEISH_CLIENT_TO_PRODUCT_2026-08-30.md` | SALES WORKING — NOT CANON | Cases / reuse; do not change site from this alone |
| `04-Projects/MEISH Business Development/CHATGPT-SIIRTOPROMPTI-VIIKKO-2026-09-01.md` | CURRENT STRONG DIRECTION (sales week) | Locked prices this week |
| `04-Projects/Meish-Treasure/` + `007-Suomen-Rakennustarkastajat/` | CUSTOMER CASE / VENTURE | Sarita / SRT — **not** a Meish.work product |
| Experience Ops / Clarion / Clara materials (portfolio + playbook refs) | CUSTOMER CASE / OLD PRIORITY | Hotel pilot history; not current Hatchling SKU |
| `03-Meish-Universe/Brand/Visual-Direction/MEISH-UNIVERSE-VISUAL-RESET-PLAN-2026-08-24.md` | VISUAL SYSTEM | Awaiting Plan ok; italic North Star was in that plan |

### C. Looked for, not found locally (or no useful match)

| Query | Result |
|-------|--------|
| Exact phrase “Creating & Clearing” | **UNKNOWN** — not found in vault/repo grep |
| “Turn Your Expertise Into Products” / “Tuotteista oma osaamisesi” as named SKU | **PRODUCT HYPOTHESIS** in this conversation’s known corrections; **not** a locked offer file |
| VÄRNA | **UNKNOWN** — no vault match |
| “Maailman paras työ” | **UNKNOWN** — no vault match |
| ChatGPT conversation exports as transcripts | Only a **siirtoprompti** week file, not a full export archive |
| Standalone Värna / Varna brand pack | Not found |

### D. Related but not Meish.work public products

Suomen Rakennustarkastajat × Sarita Lintula: real productization workspace (inspection packages, pricing 390 / 1 150 / 1 690 €). Evidence of **interview → sellable packages**. Must not appear as Meish homepage products.  
Clara / Clarion / Strawberry: historical hotel guest-signal pilot (€2,900 recommended in older 30-day playbooks). **OLD VERSION / CASE**, not Hatchling catalogue.  
Habitare / Event Orbit: sales working match to Build-with-Meish style delivery — **not** a named public SKU on the site.

---

## 1. What is Meish?

**1 sentence (supported):**  
Meish notices what is happening in human experience — then turns that into useful, tangible outputs (maps, tools, improvements, content).  
*Evidence:* Structure 1-pager 2026-08-30; Master Context §2; Hatchling “we notice things…”.

**3 sentences:**  
Human experience is the North Star. Meish does not start from “where can we put AI?” It starts from the situation: what someone actually experiences, what they want, what causes friction, what is only a story, and what should happen next. When something must be measured, changed, observed or assessed, Meish makes or chooses a tool for that — and may also remove, simplify, leave alone, or give work back to a human.

**1 paragraph:**  
Meish is a human-experience practice and a growing Universe of reusable parts (Elements), methods, tools and offers. Internally it can be large (Space, Experience, Business, You, Tools, Entities, Academy, Offspring). Publicly it must stay simple: a person or a business should understand what Meish does, see one real thing they can buy, take something useful free, and know how to start a conversation. Technology is a means. The customer stays the decision-maker. Systems should carry what the mind should not have to carry.

---

## 2. What does Meish actually do?

**CURRENT CANON / METHOD (Master Context + philosophy):**

- Find out what people actually experience now and what they want to experience  
- Make fit, friction and fiction visible  
- Recommend a next step  
- Build tools when the right ones do not exist  
- Deliver a finished useful thing from an interview (Possibility Map is the current paid proof)

**CURRENT STRONG DIRECTION (this conversation’s later corrections — only partly in files):**

Meish may remove, simplify, automate, give to AI, give back to a human, reorder, connect, make visible, or leave alone. It must not automatically refill the capacity it frees. Free time may remain free.

**Not found as a named locked method file:** “Creating & Clearing” — treat as **UNKNOWN / needs Jenni** until written into vault.

---

## 3. What can a person buy?

**CURRENT PRODUCT (thin):** Meish for You is an **entry door**, not a priced catalogue.

- Free: Clarity Starter PDF (`/gifts`)  
- Free conversation: 20-minute Fit Check framed as Meish & you (site copy already says this; **canonical public name still “Fit Check”** until Jenni decides contextual titles)

**No locked personal SKU** with price in `MEISH-AI-OFFERS.md`.  
**PRODUCT HYPOTHESIS (not ready):** Turn Your Expertise Into Products / Tuotteista oma osaamisesi.

Do **not** sell Clara, wellness packages, or therapy.

---

## 4. What can a business buy?

**CURRENT PRODUCT — locked 2026-08-18 (`MEISH-AI-OFFERS.md` + `meish-offers.ts` + week prompt 2026-09-01):**

| Offer | Price | Class |
|-------|--------|--------|
| 20-minute Fit Check | €0 · 20 min | CURRENT PRODUCT (fallback, not hero) |
| Possibility Map | €590 + VAT 25.5% Gamma · regular €950 + VAT | CURRENT PRODUCT · primary sell |
| Build with Meish | €790 + VAT · 3–4 h | CURRENT PRODUCT |
| Friction Removal | from €1,899 + VAT | CURRENT PRODUCT |
| Human Experience Review | after Fit Check / scope | CONDITIONAL |
| A Week with Meish | from €7,500 + VAT | CURRENT PRODUCT (premium, secondary) |

**CONFLICT — deliverable detail of Possibility Map:**  
Offers file lists 14-day plan + AI/SaaS opportunities. Storefront `meish-offers.ts` lists 30-day actions, three routes, walkthrough, five business days. Revenue-operator product spec in this project’s working memory: interview, visible map, three routes, recommendation, 30 days, AI review, walkthrough. **Do not silently pick.** Label **CONFLICT** until Jenni confirms the public includes-list.

**Not a Phase 1 website product:** Put AI to Work (homepage invention — no offer record).  
**Not public:** Treasure, SRT packages, Clara €2,900, Signal Review hotel SKUs, Event Orbit €7,500.

---

## 5. What can someone use without hiring Meish?

**CURRENT IMPLEMENTATION:** Meish Clarity Starter PDF — one page, five questions, no signup.

**CURRENT STRONG DIRECTION:** Tools = useful things you can use without us; Gifts = take something useful with you.

**NOT READY for Tools as products:** public Elements table, Friction/Fiction tool routes, Abundance downloads, Tonnitesti/Skaalatesti SKUs (Hatchling §5).

---

## 6. Strongest real examples / cases

| Case | Class | Website use |
|------|--------|-------------|
| Possibility Map Gamma as the live B2B offer | CURRENT PRODUCT | Yes — named, priced |
| Suomen Rakennustarkastajat × Sarita (packages, interview → products) | CUSTOMER CASE / VENTURE | **No** on Meish.work (wrong brand) |
| Clara / Clarion / Strawberry hotel pilot | OLD VERSION / CASE | **No** as current SKU; may inform ExR later |
| Habitare inspiration→action layer | SALES WORKING | **No** until sold/delivered |
| Kwelo / Freyas mentioned in week prompt | LEAD / HYPOTHESIS | **No** as published case (no vault case study found) |

**No published “customer result” page found.** Strongest *public* proof is the priced Possibility Map itself, not a case study.

---

## 7. What makes Meish different?

Supported by Master Context + 1-pager + philosophy:

- Starts from lived experience, not from placing AI  
- Makes something useful and finished, not only advice  
- Outcome First: customer buys the result; Meish owns methods  
- Recognition before creation; reuse Elements  
- Human stays in charge; AI is support  
- Universe can be complex; visitor must not learn the Universe  
- Not a generic AI agency, wellness clinic, or SaaS product grid

---

## 8. Customer journey (public, Hatchling)

From Interaction Canon + Hatchling + ASIAKASPUTKI:

1. Arrive (home) — understand Meish in seconds  
2. Choose a door: Business / You / Tools / Gifts  
3. If unsure: contextual Fit Check (free, 20 min) — **not a fitness test, not a forced gate**  
4. If they already know: contact / buy Possibility Map (or other locked offer) directly  
5. Paid path (Map): accept → invoice → pay → interview → delivery → walkthrough → feedback  

**CONFLICT:** Hatchling once made Fit Check the primary header CTA. Later commercial correction: Fit Check is secondary. Site data already treats it as fallback. Keep secondary.

---

## 9. What Meish needs from the customer

From offer records:

- Possibility Map: ~60 min interview + time for walkthrough  
- Build: 3–4 h joint session with a clear goal  
- Friction: participation in assessment and rollout talks  
- ExR: access to the place or journey  
- Fit Check: 20 min conversation  

Always: a real situation, permission to notice, and a human decision-maker.

---

## 10. What the homepage should explain in the first 10 seconds

Supported by 1-pager tests + Hatchling + later commercial order:

1. Name: **Meish** / Meish Universe  
2. North Star: **Human experience is our North Star.**  
3. One plain sentence of what Meish does (notice → useful thing)  
4. Languages: English and Finnish  
5. Four doors (Business, You, Tools, Gifts)  
6. One real buyable thing visible immediately (Possibility Map)  

Visitor must not need the Table of Elements, Entities, or facet system.

---

## 11. Current homepage information — KEEP / CHANGE / REMOVE

Based on uncommitted `index.astro` + `MeishUniverseScene.astro` (preview).

| Item | Verdict | Why |
|------|---------|-----|
| Name Meish + Universe | KEEP | Canon |
| Human experience is our North Star | KEEP (wording) | Canon |
| Short “we notice… make useful things” | KEEP / tighten | Matches 1-pager |
| EN / FI languages | KEEP | Required |
| Four public doors | KEEP | Hatchling + later Gifts addition |
| Possibility Map €590 + VAT Gamma / €950 regular | KEEP (price) | Locked; no price conflict on numbers |
| Other locked Business offers listed after Map | KEEP (as proof more exists) | Hatchling catalogue |
| Fit Check as optional fallback | KEEP | Later correction |
| Clarity / Gifts pointer | KEEP | Real free asset exists |
| Contact / Should we Meish this? | CHANGE | Name CONFLICT (Fit Check vs this phrase) |
| Call Meish / three steps hook | CHANGE | Direction OK; must not invent a new product |
| **Put AI to Work** as featured/rail product | REMOVE from Phase 1 | No offer file; violates “do not add AI product because AI exists” |
| Italic / boutique serif North Star treatment | REMOVE (visual) | Jenni visual rejection 2026-08-31; do not pick replacement yet |
| Current Intensive diamond as public hero | REMOVE (visual) | Jenni rejected; replace later, separately |
| Dark decorative extra blocks / neon leftover | REMOVE if still present | Visual rejection |
| F1–F7 / 7 Facet System as public copy | REMOVE if any | Internal visual system only |
| Full Universe areas (Entities, Academy, Space as nav) | REMOVE / do not add | Hatchling |

---

## 12. Products ready enough for Phase 1 website

- Possibility Map (Gamma) — **primary**  
- Build with Meish — Business page, not hero  
- Friction Removal — Business page  
- Fit Check — secondary, contextual copy later  
- A Week with Meish — secondary / premium  
- Gifts: Clarity Starter — Tools/Gifts door  

---

## 13. Products not ready enough

- Put AI to Work (invented on homepage)  
- Turn Your Expertise Into Products (hypothesis)  
- Human Experience Review as a fixed-price hero (conditional)  
- Meish Table of Elements / Explore the Elements (in development)  
- Public Elements SKUs  
- Clara / hotel Signal Review as current catalogue  
- Treasure / Rootling / Printed shop  
- Event Orbit / Habitare SKU  
- Any AI assistant product  

---

## 14. Important Meish knowledge the current website missed

1. Meish does **not** begin with “where can we put AI?” — homepage still leans AI-first via Put AI to Work and Map summary “where AI and Meish can create value”.  
2. **Creating & Clearing** (if Jenni confirms) — not on site; also **not in vault** yet.  
3. Freed capacity must not be automatically refilled; free time may stay free.  
4. Fit Check must be **contextual** (You vs Your Business) — site has one generic Fit Check.  
5. Interview → valuable finished thing is a core capability — under-explained except inside Map.  
6. Product diamonds are **compositional seals**, not decoration — not communicable until a new diamond exists.  
7. Applicability vs functional family (colour meaning) — internal; must not be taught on home.  
8. Outcome First / Recognition Before Creation — not stated simply.  
9. Tools = usable without hiring Meish — Tools page historically thin / methods-essay risk.  
10. Real cases exist (SRT productization, hotel ExR history) but **must not be dumped** as Meish SKUs; a *later* “how we work” example could be written with Jenni.

---

## 15. Primary authorities (recommended)

Use in this order when they conflict:

1. **Jenni’s later explicit correction** (this audit’s known corrections list) — if not yet in a file, mark NEEDS JENNI to write it down  
2. `Meish Universe Source of Truth.md` — names, structure, entities  
3. `MEISH_CURSOR_MASTER_CONTEXT.md` — content, tone, process language  
4. `MEISH-AI-OFFERS.md` + `meish-offers.ts` — what can be sold and at what price (price numbers agree)  
5. `MEISH-UNIVERSE-STRUCTURE-ONE-PAGER.md` (2026-08-30) — public vs internal, Table naming  
6. `MEISH-HATCHLING-LAUNCH-SCOPE.md` + Interaction Canon — public routes and journey  
7. Glossary — term locks  
8. Philosophy files — how to speak about experience  

**Do not treat as primary:** Hyperagent exports, Visual Reset plan’s typography choice, `UniverseHero.astro`, GO-LIVE Cloudflare, Client-to-Product as canon, this conversation’s homepage drafts.

---

## 16. Conflicting information

| Topic | A | B | Label |
|-------|---|---|--------|
| Fit Check name | Glossary + Hatchling + offers: **Fit Check** | Handoff / some site CTAs: **Should we Meish this?** / Fit Call | CONFLICT — Jenni |
| Fit Check role | Hatchling: primary header CTA | Later commercial: secondary fallback | Later correction wins for homepage |
| Fit Check wording | “Meish AI Fit Check” (offers email) | Contextual “Meish & You / & Your Business” (later correction) | CONFLICT |
| Public email | Hatchling 2026-08-24: `jenni@meish.work` | Live/site: `moona.m@meish.work` | CONFLICT (ops) |
| Map includes | Offers.md: 14-day plan, AI/SaaS list | Storefront: 30 days, three routes, 5 business days | CONFLICT |
| Map framing | Offers.md opens with “need AI competence?” | Later: do not start from AI | Later correction should govern **website** tone; offers file still sales-lock for **price** |
| Gifts in nav | Hatchling: Gifts not a route until gift exists | Gift PDF now exists; 1-pager + site include Gifts | Later: KEEP Gifts |
| Diamond | Brand lock Intensive | Jenni 2026-08-31: old diamond rejected | VISUAL SUPERSEDED for public; lock file not updated |
| Typography | Visual reset: italic serif North Star | Jenni 2026-08-31: reject boutique italic | VISUAL SUPERSEDED |
| “Meish Elementary System” | Some older IA/docs | 1-pager: **do not use publicly** | SUPERSEDED term |
| Put AI to Work | Homepage rail | No offer canon | PRODUCT HYPOTHESIS / REMOVE |

---

## 17. Still unknown

- Written definition of **Creating & Clearing**  
- Whether **Turn Your Expertise Into Products** is approved to name on Phase 1  
- Which diamond file replaces Intensive  
- Which typeface replaces Bodoni italic (explicitly: do not choose yet)  
- Whether any paying Possibility Map client exists yet (pipeline table empty)  
- VÄRNA material location  
- Maailman paras työ archive location  
- Whether `jenni@` or `moona.m@` is the public mailbox going forward  
- Exact public includes-list for Possibility Map  
- Whether Build with Meish = the “interview → useful thing” product or Map is  

---

## 18. Questions that genuinely need Jenni

1. Confirm Phase 1 **only** locked offers (Map first) — **no** Put AI to Work on the homepage. Yes/no?  
2. Fit Check **public name**: keep “Fit Check” and add contextual suffixes, or rename?  
3. Possibility Map **public includes**: 14-day (offers.md) vs 30-day / three routes (storefront). Which list?  
4. Public email: `moona.m@` vs `jenni@`.  
5. Write **Creating & Clearing** into vault as canon, or keep internal only?  
6. Is **Turn Your Expertise** allowed as a named hypothesis on the site, or vault-only until first Map is sold?  
7. After audit: replace diamond and type only — keep current IA?  

---

## Answers 1–18 (compact)

Already answered in sections 1–18 above.

---

## Homepage vs later corrections (visual)

- Italic decorative serif: **rejected** — do not replace until after this review.  
- Current Intensive diamond: **rejected** for public — replace separately.  
- Do not implement another visual pass in this audit.

---

*End of original audit. No website files were redesigned for that document.*

---

## Public lock — 2026-08-31 (release manager)

Applied on `meish-work-public` only. Not production.

**Public doors:** Meish & Your Business · Meish & You · Tools · Gifts for You

**Fit Check names (never generic “20-minute Fit Check”):**
- 20-minute Meish & You Fit Check
- 20-minute Meish & Your Business Fit Check

**Public symbol name:** MEISH DIAMOND (not “7-facet Meish Diamond”).

**Typography:** 2 families, 3 roles. No romantic italic on homepage. New webfont = Jenni visual approval.

**Do not build for launch:** Meish Table of Elements as a public product.

**Still needs Jenni (visual):** which rendered MEISH DIAMOND asset is public canon. Do not treat filenames as authority.

