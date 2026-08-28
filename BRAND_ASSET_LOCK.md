# Brand asset lock

DO NOT REPLACE OR REDRAW these files.
DO NOT generate images, SVG approximations, clip-paths, or alternative crystal geometry.
DO NOT change bytes of the canonical diamond.

## Canonical standalone diamond

- Path: `public/brand/meish-diamond-universe.jpg`
- Format: JPEG 360×540 (supplied Brand Kit diamond, no wordmark)
- SHA-256: `28bf91e24fafaeb806be789d87b849f0f7376adba9186e5983b5b4785c2faffb`

Use this file for every standalone diamond on the public site.
Allowed variation: size, opacity, blur, perspective, z-depth, subtle rotation.
Forbidden: geometry change, facet invention, hue-rotate, recolour.

## Canonical lockup

- Path: `public/brand/meish-universe-lockup-cream.png`
- SHA-256: `e422584ba940ee6f5a52d3ed93f87c84322ccdd0e487fb0c522486be6bc8b4d1`

Wordmark + diamond together. Do not use as a repeating nebula gem.

## Typography

- Headings: ATHENA Condensed — **ATHENA ASSET MISSING** (`public/fonts/` is empty)
- Body: Roboto Regular
- Local temporary fallback only: Bodoni Moda. Not final branding.

## Integrity

`npm run check:brand` (also `prebuild`) fails if canonical diamond or lockup bytes change.
