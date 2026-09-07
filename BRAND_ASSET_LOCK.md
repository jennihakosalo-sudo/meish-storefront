# Brand asset lock

DO NOT REPLACE OR REDRAW the Intensive diamond without an explicit visual decision.
DO NOT tilt diamonds (CSS rotate on gem faces). Diamonds are always upright.
Diamonds must use a **transparent (RGBA) PNG** — never an opaque white/dark box.

## Canonical Intensive diamond (live hero)

- Path: `public/brand/meish-diamond-intensive.png`
- Format: PNG RGBA (transparent background)
- SHA-256: `3ec3ac4e57f54cc0530cb384d41225907ac74d4fc11250ccd139c11df861ba01`
- Web display: `public/brand/meish-diamond-intensive-720.png` (RGBA, ~720px tall)

Use Intensive only on **Deep Space** surfaces. Do not place diamonds as boxed marks on cream pages.

Allowed: size, opacity, blur, drop-shadow.
Forbidden: tilt, baked opaque background, card/border framing the gem.

## Archived

- `public/brand/archive/pre-alpha-meish-diamond-intensive*.png` — opaque RGB versions

## Canonical lockup (optional / archive)

- Path: `public/brand/meish-universe-lockup-cream.png`
- SHA-256: `e422584ba940ee6f5a52d3ed93f87c84322ccdd0e487fb0c522486be6bc8b4d1`

## Integrity

`npm run check:brand` (also `prebuild`) fails if Intensive diamond or lockup bytes change.
