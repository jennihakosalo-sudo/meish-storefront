/* ==========================================================================
   Meish Printed — Product catalog + design-tool model  (MEI-3)
   ---------------------------------------------------------------------------
   Single source of truth for the catalogue AND the in-browser design tool.
   Both the storefront pages and the client-side editor consume these types,
   so geometry is expressed once here and reused everywhere:

   - All layout geometry is in MILLIMETRES, relative to each product's own
     print size. The editor renders at screen scale (px = mm * stageScale) and
     exports at print scale (px = mm * dpi / 25.4). One coordinate space, two
     scale factors — no drift between preview and print-ready artifact.

   This is a static content model for the MVP. MEI-18 may later move it behind
   a CMS a non-technical admin can edit; the shapes below are the contract.
   ========================================================================== */

export type CategoryId = 'quotes' | 'wall-decor' | 'tin-plates' | 'restaurant';

export interface Category {
  id: CategoryId;
  name: string;
  blurb: string;
}

export const categories: Category[] = [
  {
    id: 'quotes',
    name: 'Quote prints',
    blurb: 'Typographic art prints — a line worth living with, set with care.',
  },
  {
    id: 'wall-decor',
    name: 'Wall décor',
    blurb: 'Large-format prints made to be looked at twice.',
  },
  {
    id: 'tin-plates',
    name: 'Tin plates',
    blurb: 'Enamel-style metal signs with an honest, hard-wearing charm.',
  },
  {
    id: 'restaurant',
    name: 'Restaurant single-use',
    blurb: 'Placemats, coasters and menu cards — printed by the run, used once, remembered.',
  },
];

/* --- Design layers --------------------------------------------------------
   A layer is one editable element on the canvas. Coordinates are the layer's
   top-left corner in mm; sizes are in mm. Text size is in mm cap-to-baseline
   (close enough to points at print scale for an MVP proofing tool). */

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

export interface Product {
  slug: string;
  name: string;
  category: CategoryId;
  tagline: string;
  description: string;
  priceLabel: string;
  material: string;
  orientationNote: string;
  width_mm: number;
  height_mm: number;
  dpi: number;
  bleed_mm: number;
  /** Warm swatch used for the photography placeholder until real shots land. */
  tone: string;
  templates: Template[];
}

/* --- Geometry helpers (shared by pages and editor) ----------------------- */

export function printPixels(p: Pick<Product, 'width_mm' | 'height_mm' | 'dpi'>) {
  const factor = p.dpi / 25.4;
  return {
    width: Math.round(p.width_mm * factor),
    height: Math.round(p.height_mm * factor),
  };
}

export function aspectRatio(p: Pick<Product, 'width_mm' | 'height_mm'>) {
  return p.width_mm / p.height_mm;
}

/* --- Layer factories (keep template authoring terse & consistent) --------- */

let _uid = 0;
const uid = (prefix: string) => `${prefix}-${++_uid}`;

function text(partial: Partial<TextLayer> & Pick<TextLayer, 'text' | 'x' | 'y' | 'w' | 'size'>): TextLayer {
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

function image(partial: Partial<ImageLayer> & Pick<ImageLayer, 'x' | 'y' | 'w' | 'h'>): ImageLayer {
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
   The catalogue
   ========================================================================== */

export const products: Product[] = [
  /* --- Quote prints ------------------------------------------------------ */
  {
    slug: 'verse-quote-print',
    name: 'Verse',
    category: 'quotes',
    tagline: 'A line worth living with.',
    description:
      'A typographic art print for a single line that means something — a vow, a lyric, a family saying. Set in our editorial serif on warm archival paper.',
    priceLabel: 'from €24',
    material: 'Giclée on 240gsm warm-white cotton paper',
    orientationNote: 'Portrait · A3',
    width_mm: 297,
    height_mm: 420,
    dpi: 300,
    bleed_mm: 3,
    tone: '#c98a5e',
    templates: [
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
  },

  /* --- Wall décor -------------------------------------------------------- */
  {
    slug: 'atelier-poster',
    name: 'Atelier',
    category: 'wall-decor',
    tagline: 'Large-format, small-batch.',
    description:
      'A generous wall piece that pairs a photograph with a title. Bring your own image — a place, a person, a plate of food — and let it hold a room.',
    priceLabel: 'from €48',
    material: 'Matte fine-art poster, 500 × 700 mm',
    orientationNote: 'Portrait · 50 × 70 cm',
    width_mm: 500,
    height_mm: 700,
    dpi: 300,
    bleed_mm: 3,
    tone: '#7d8b74',
    templates: [
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
  },

  /* --- Tin plates -------------------------------------------------------- */
  {
    slug: 'enamel-tin-plate',
    name: 'Enamel',
    category: 'tin-plates',
    tagline: 'Made to be nailed to a wall.',
    description:
      'An enamel-style metal sign with a hard-wearing, honest charm — house rules, a bar name, a welcome. Rounded corners, drilled for hanging.',
    priceLabel: 'from €18',
    material: 'Powder-coated steel, 200 × 300 mm',
    orientationNote: 'Portrait · 20 × 30 cm',
    width_mm: 200,
    height_mm: 300,
    dpi: 300,
    bleed_mm: 4,
    tone: '#b4552d',
    templates: [
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
  },

  /* --- Restaurant single-use -------------------------------------------- */
  {
    slug: 'table-placemat',
    name: 'Table N°',
    category: 'restaurant',
    tagline: 'Printed by the run, used once, remembered.',
    description:
      'A single-use paper placemat sized for A3 landscape. Set your restaurant name, a welcome and a photo — ideal for events, tastings and seasonal menus.',
    priceLabel: 'from €0.40 / unit',
    material: 'Uncoated 120gsm paper, A3 landscape, printed in runs of 250+',
    orientationNote: 'Landscape · A3',
    width_mm: 420,
    height_mm: 297,
    dpi: 150,
    bleed_mm: 3,
    tone: '#b4552d',
    templates: [
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
  },
  {
    slug: 'paper-coaster',
    name: 'Coaster',
    category: 'restaurant',
    tagline: 'A small square with a name on it.',
    description:
      'Square single-use paper coaster. Perfect for a logo, a hashtag or a house cocktail — printed in generous runs for bars and events.',
    priceLabel: 'from €0.15 / unit',
    material: 'Pulpboard coaster, 95 × 95 mm, runs of 500+',
    orientationNote: 'Square · 9.5 cm',
    width_mm: 95,
    height_mm: 95,
    dpi: 300,
    bleed_mm: 3,
    tone: '#c98a5e',
    templates: [
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
  },
  {
    slug: 'menu-card',
    name: 'Menu card',
    category: 'restaurant',
    tagline: 'The day, on a card.',
    description:
      'A tall single-use menu card for daily specials and tasting flights. Set a heading and a photo; the kitchen fills the rest at the table.',
    priceLabel: 'from €0.30 / unit',
    material: 'Uncoated 250gsm card, 100 × 210 mm, runs of 250+',
    orientationNote: 'Portrait · DL',
    width_mm: 100,
    height_mm: 210,
    dpi: 300,
    bleed_mm: 3,
    tone: '#7d8b74',
    templates: [
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
  },
];

/* --- Lookups -------------------------------------------------------------- */

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function productsByCategory(id: CategoryId): Product[] {
  return products.filter((p) => p.category === id);
}

export function categoryName(id: CategoryId): string {
  return categories.find((c) => c.id === id)?.name ?? id;
}
