/* ==========================================================================
   Meish Printed — Design-studio templates  (MEI-3 · code-authored)
   ---------------------------------------------------------------------------
   These are the starting layouts the in-browser editor loads. Their geometry
   is expressed in MILLIMETRES relative to each product's print size — the same
   coordinate space the editor renders and exports in.

   WHY THIS IS CODE, NOT CMS CONTENT (see MEI-18):
   A template is precise layout geometry (layer positions, wrap widths, cap
   heights, tracking). Handing that to a non-technical admin as CMS fields would
   be error-prone and confusing. So the *catalogue* — the parts a shop owner
   actually edits (name, price, description, category, size) — lives in editable
   JSON under src/content/products/, while these templates stay in code and are
   attached to a product by its slug.

   A product with no entry here still works: the loader gives it one sensible
   default template, and the editor lets the customer build from there.
   ========================================================================== */

export type FontKey = 'display' | 'body' | 'mono';
export type Align = 'left' | 'center' | 'right';
export type Fit = 'cover' | 'contain';

export interface TextLayer {
  id: string;
  type: 'text';
  text: string;
  x: number;
  y: number;
  w: number; // wrap width in mm
  font: FontKey;
  size: number; // mm
  color: string;
  weight: number;
  italic: boolean;
  align: Align;
  lineHeight: number; // multiplier
  tracking: number; // em
}

export interface ImageLayer {
  id: string;
  type: 'image';
  /** data-URL when the customer uploads; null renders an "add photo" slot. */
  src: string | null;
  x: number;
  y: number;
  w: number;
  h: number;
  fit: Fit;
  radius: number; // mm
}

export type Layer = TextLayer | ImageLayer;

export interface Template {
  id: string;
  name: string;
  background: string; // hex
  /** Layers are stored in paint order (first = back). */
  layers: Layer[];
}

/* --- Layer factories (keep template authoring terse & consistent) --------- */

let _uid = 0;
const uid = (prefix: string) => `${prefix}-${++_uid}`;

function text(
  partial: Partial<TextLayer> & Pick<TextLayer, 'text' | 'x' | 'y' | 'w' | 'size'>,
): TextLayer {
  return {
    id: uid('t'),
    type: 'text',
    font: 'display',
    color: '#1f1a16',
    weight: 600,
    italic: false,
    align: 'center',
    lineHeight: 1.1,
    tracking: 0,
    ...partial,
  };
}

function image(
  partial: Partial<ImageLayer> & Pick<ImageLayer, 'x' | 'y' | 'w' | 'h'>,
): ImageLayer {
  return {
    id: uid('i'),
    type: 'image',
    src: null,
    fit: 'cover',
    radius: 0,
    ...partial,
  };
}

/* ==========================================================================
   Templates, keyed by product slug
   ========================================================================== */

export const templatesBySlug: Record<string, Template[]> = {
  'verse-quote-print': [
    {
      id: 'verse-centered',
      name: 'Centered verse',
      background: '#f7f3ec',
      layers: [
        text({
          text: 'and still,\nwe rise',
          x: 30,
          y: 150,
          w: 237,
          size: 46,
          weight: 600,
          italic: true,
          lineHeight: 1.05,
        }),
        text({
          text: 'MEISH PRINTED',
          x: 30,
          y: 360,
          w: 237,
          size: 6,
          font: 'body',
          weight: 600,
          color: '#877c6f',
          tracking: 0.3,
        }),
      ],
    },
    {
      id: 'verse-quiet',
      name: 'Quiet corner',
      background: '#efe9df',
      layers: [
        text({
          text: 'grow\nslowly',
          x: 26,
          y: 40,
          w: 200,
          size: 54,
          align: 'left',
          weight: 600,
          color: '#5c6b57',
        }),
        text({
          text: 'a note to keep',
          x: 26,
          y: 385,
          w: 200,
          size: 7,
          font: 'body',
          align: 'left',
          color: '#877c6f',
          tracking: 0.2,
        }),
      ],
    },
  ],

  'atelier-poster': [
    {
      id: 'atelier-photo-title',
      name: 'Photo & title',
      background: '#fffdf9',
      layers: [
        image({ x: 40, y: 40, w: 420, h: 500, fit: 'cover', radius: 2 }),
        text({
          text: 'Sunday, slowly',
          x: 40,
          y: 570,
          w: 420,
          size: 40,
          align: 'left',
          weight: 600,
        }),
        text({
          text: 'THE KITCHEN SERIES · N°04',
          x: 40,
          y: 640,
          w: 420,
          size: 9,
          font: 'body',
          align: 'left',
          color: '#877c6f',
          tracking: 0.25,
        }),
      ],
    },
    {
      id: 'atelier-full-bleed',
      name: 'Full bleed',
      background: '#1f1a16',
      layers: [
        image({ x: 0, y: 0, w: 500, h: 700, fit: 'cover', radius: 0 }),
        text({
          text: 'MEISH',
          x: 30,
          y: 620,
          w: 440,
          size: 30,
          align: 'left',
          weight: 900,
          color: '#f7f3ec',
        }),
      ],
    },
  ],

  'enamel-tin-plate': [
    {
      id: 'enamel-house-rules',
      name: 'House rules',
      background: '#8f4021',
      layers: [
        text({
          text: 'THE\nKITCHEN',
          x: 15,
          y: 40,
          w: 170,
          size: 30,
          weight: 900,
          color: '#f7f3ec',
          lineHeight: 1.0,
        }),
        text({
          text: 'good food · loud table · no rush',
          x: 15,
          y: 175,
          w: 170,
          size: 9,
          font: 'body',
          weight: 600,
          color: '#f0e2d6',
          tracking: 0.1,
        }),
      ],
    },
    {
      id: 'enamel-badge',
      name: 'Badge',
      background: '#5c6b57',
      layers: [
        text({
          text: 'EST.\n2026',
          x: 15,
          y: 90,
          w: 170,
          size: 40,
          weight: 900,
          color: '#f7f3ec',
          lineHeight: 0.95,
        }),
        text({
          text: 'MEISH PRINTED CO.',
          x: 15,
          y: 250,
          w: 170,
          size: 8,
          font: 'body',
          weight: 600,
          color: '#f0e2d6',
          tracking: 0.28,
        }),
      ],
    },
  ],

  'table-placemat': [
    {
      id: 'placemat-welcome',
      name: 'Welcome',
      background: '#f7f3ec',
      layers: [
        text({
          text: 'Welcome to\nthe table',
          x: 30,
          y: 60,
          w: 240,
          size: 34,
          align: 'left',
          italic: true,
        }),
        text({
          text: 'MENU DU JOUR · PRINTED FRESH DAILY',
          x: 30,
          y: 220,
          w: 240,
          size: 8,
          font: 'body',
          align: 'left',
          color: '#877c6f',
          tracking: 0.22,
        }),
        image({ x: 290, y: 40, w: 100, h: 217, fit: 'cover', radius: 3 }),
      ],
    },
  ],

  'paper-coaster': [
    {
      id: 'coaster-mark',
      name: 'House mark',
      background: '#1f1a16',
      layers: [
        text({
          text: 'MEISH',
          x: 8,
          y: 34,
          w: 79,
          size: 16,
          weight: 900,
          color: '#f7f3ec',
        }),
        text({
          text: 'BAR · KITCHEN',
          x: 8,
          y: 56,
          w: 79,
          size: 5,
          font: 'body',
          weight: 600,
          color: '#c98a5e',
          tracking: 0.3,
        }),
      ],
    },
  ],

  'menu-card': [
    {
      id: 'menu-daily',
      name: 'Daily',
      background: '#efe9df',
      layers: [
        text({
          text: 'Today',
          x: 8,
          y: 20,
          w: 84,
          size: 26,
          align: 'left',
          italic: true,
        }),
        text({
          text: 'CHEF’S SELECTION',
          x: 8,
          y: 52,
          w: 84,
          size: 6,
          font: 'body',
          align: 'left',
          color: '#877c6f',
          tracking: 0.28,
        }),
        image({ x: 8, y: 70, w: 84, h: 120, fit: 'cover', radius: 2 }),
      ],
    },
  ],
};

/* --- Default template --------------------------------------------------------
   A brand-new product added from the CMS won't have a code template yet. Rather
   than crash the studio, give it one clean, centered starting layout derived
   from its own print size so the customer can begin designing immediately. */

export function defaultTemplate(p: {
  width_mm: number;
  height_mm: number;
  name: string;
}): Template {
  return {
    id: 'default',
    name: 'Blank',
    background: '#f7f3ec',
    layers: [
      text({
        text: p.name,
        x: p.width_mm * 0.1,
        y: p.height_mm * 0.42,
        w: p.width_mm * 0.8,
        size: Math.max(10, Math.round(p.width_mm * 0.12)),
        weight: 600,
        italic: true,
      }),
    ],
  };
}
