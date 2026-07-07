# Meish Printed — Design System

**Feel:** a boutique print studio — warm, calm, editorial. Strong display
typography, generous whitespace, product photography carrying the color. The
opposite of a generic SaaS dashboard.

All values live in `src/styles/tokens.css` and are rendered live at `/style`.
**Rule: components never hard-code a hex, size, or spacing value — always
reference a token.**

## Color

Warm paper and ink, with a single clay accent used sparingly (CTAs, links,
small marks) and a sage secondary for category tags.

| Token | Value | Use |
|---|---|---|
| `--color-paper` | `#f7f3ec` | Page background (warm off-white) |
| `--color-paper-sunk` | `#efe9df` | Recessed sections / bands |
| `--color-paper-raised` | `#fffdf9` | Raised cards |
| `--color-ink` | `#1f1a16` | Primary text (warm near-black) |
| `--color-ink-soft` | `#4a423a` | Secondary text |
| `--color-ink-muted` | `#877c6f` | Captions, meta, placeholders |
| `--color-line` | `#e2d9cb` | Hairline borders / rules |
| `--color-clay` | `#b4552d` | **Accent** — CTAs, links |
| `--color-clay-deep` | `#8f4021` | Accent hover / pressed |
| `--color-sage` | `#5c6b57` | Category tags |

Semantic aliases (`--bg`, `--surface`, `--text`, `--accent`, `--border`, …) sit
on top so a future rebrand or dark mode is a token change, not a component sweep.

## Typography

- **Display / headings:** `Fraunces Variable` — a characterful editorial serif.
  Weights 400 (italic accents) and 600–900 (headings, wordmark).
- **Body / UI:** `Inter Variable` — quiet, legible.
- Both self-hosted via `@fontsource-variable/*` — no external font requests,
  fast first paint, works offline in CI.

**Scale** — major-third (1.250) modular scale from a 16px base:

| Token | Size | Role |
|---|---|---|
| `--text-xs` | 11px | Eyebrows, labels |
| `--text-sm` | 13px | Captions, meta |
| `--text-base` | 16px | Body |
| `--text-md` | 20px | Lead paragraphs |
| `--text-lg` | 25px | h3 |
| `--text-xl` | 31px | h2 |
| `--text-2xl` | 39px | h1 |
| `--text-3xl` | 61px | Display |
| `--text-hero` | fluid `clamp()` | Hero display |

Weights `--weight-regular/medium/semibold/black`; line-heights
`--leading-tight/snug/normal`; tracking `--tracking-tight/normal/wide`.

## Spacing

4px base, gentle geometric growth: `--space-2xs` (4px) → `--space-4xl` (160px).
Section rhythm uses `--space-3xl` (104px). Use spacing tokens for margins,
padding and gaps — no magic numbers.

## Layout

`--measure` (68ch) readable column · `--width-content` (1080px) editorial width ·
`--width-wide` (1320px) galleries · `--gutter` fluid page padding.

## Primitives (in `global.css`)

- `.container` / `.container--wide` — centered max-width wrappers
- `.section` — vertical section rhythm
- `.eyebrow` — tracked-out uppercase label (boutique signature)
- `.lead` — larger intro paragraph
- `.button` + `.button--primary` / `.button--ghost` — pill buttons
- `.tag` — category label · `.rule` — hairline divider

## Accessibility

- Warm-neutral palette keeps body text (ink on paper) well above WCAG AA.
- `prefers-reduced-motion` honored; visible focus + skip-link in the layout.
- Semantic headings, `aria-current` on active nav, `aria-label`s on landmarks.

## Extending

New surface? Compose from tokens + primitives. New brand color? Add a
`--color-*` swatch **and** a semantic alias. Keep `/style` in sync — it is the
living contract for the system.
