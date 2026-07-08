/* ==========================================================================
   Meish Printed — Product catalogue  (content model + loader)
   ---------------------------------------------------------------------------
   MEI-18: the catalogue is no longer hand-written TypeScript. Each product is
   an editable JSON file under `src/data/catalog/`, so a NON-technical admin
   can add or change products through the /admin CMS (Decap) without touching
   code. On save the CMS commits a JSON file; the next build picks it up and the
   product renders statically. See docs/CONTENT.md.

   This module is the runtime contract the rest of the app already depends on:
   it loads those JSON files at BUILD TIME (synchronously, via Vite's
   `import.meta.glob`), validates them, attaches the code-authored design
   templates (src/data/templates.ts) by slug, and exposes the same `products`
   array + lookups the pages and the editor have always used. No consumer had to
   change its call signature.

   Two coordinate/authoring layers, kept deliberately separate:
     • Catalogue fields (name, price, description, category, print size) → JSON,
       CMS-editable. This is what a shop owner actually edits.
     • Design templates (precise layer geometry in mm) → code, per MEI-3.
   ========================================================================== */

import { templatesBySlug, defaultTemplate } from './templates';
import type { Template, Layer, TextLayer, ImageLayer, FontKey, Align, Fit } from './templates';

// Re-export the design-tool types from here so existing imports keep working
// (the editor imports Product/Layer/etc. from this module).
export type { Template, Layer, TextLayer, ImageLayer, FontKey, Align, Fit };

/* --- Categories -----------------------------------------------------------
   The category set is small, drives page layout/copy, and rarely changes, so
   it stays in code. The CMS presents these as a fixed dropdown when an admin
   assigns a product to a category. */

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

const CATEGORY_IDS = categories.map((c) => c.id);

/* --- The product shape ----------------------------------------------------
   `price` is the machine price used by checkout (MEI-4). Keeping it on the
   product means the admin sets the real charge and the human `priceLabel` in
   one place, and there is a single source of truth for money. */

export interface ProductPrice {
  /** Price per unit, in euro cents. What the card is actually charged. */
  unitAmountCents: number;
  /** Minimum order quantity (restaurant items print in runs). */
  minQuantity: number;
  /** Short unit label shown in the cart, e.g. "per print" / "per unit". */
  unitLabel: string;
}

export interface Product {
  slug: string;
  name: string;
  category: CategoryId;
  tagline: string;
  description: string;
  /** Human price shown on the storefront, e.g. "from €24". */
  priceLabel: string;
  /** Machine price for checkout. Optional: a product can list before it is priced. */
  price?: ProductPrice;
  material: string;
  orientationNote: string;
  width_mm: number;
  height_mm: number;
  dpi: number;
  bleed_mm: number;
  /** Warm swatch used for the photography placeholder until real shots land. */
  tone: string;
  /** Optional product photo (public path, e.g. /images/products/foo.jpg). When
   *  absent, the card/detail fall back to the tinted `tone` placeholder. */
  image?: string;
  /** Lower sorts first within a category. Defaults to 100. */
  order: number;
  /** Attached from src/data/templates.ts by slug (never authored in the CMS). */
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

/* ==========================================================================
   Load + validate the JSON catalogue at build time
   ========================================================================== */

/** The raw shape an admin edits in a JSON file (slug comes from the filename,
 *  templates are attached from code). Everything is validated below. */
interface RawProduct {
  name: string;
  category: string;
  tagline: string;
  description: string;
  priceLabel: string;
  price?: Partial<ProductPrice>;
  material: string;
  orientationNote: string;
  width_mm: number;
  height_mm: number;
  dpi: number;
  bleed_mm: number;
  tone: string;
  image?: string;
  order?: number;
}

/** Turn a glob key like "./catalog/verse-quote-print.json" into a slug. */
function slugFromPath(path: string): string {
  return path.split('/').pop()!.replace(/\.json$/, '');
}

function fail(slug: string, msg: string): never {
  throw new Error(
    `Invalid product "${slug}.json": ${msg}. Fix the field in the /admin CMS (or the JSON file) and rebuild.`,
  );
}

function str(slug: string, raw: RawProduct, key: keyof RawProduct): string {
  const v = raw[key];
  if (typeof v !== 'string' || v.trim() === '') fail(slug, `"${String(key)}" must be a non-empty text value`);
  return v as string;
}

function num(slug: string, raw: RawProduct, key: keyof RawProduct): number {
  const v = raw[key];
  if (typeof v !== 'number' || !Number.isFinite(v) || v <= 0) fail(slug, `"${String(key)}" must be a positive number`);
  return v as number;
}

function normalize(slug: string, raw: RawProduct): Product {
  if (!CATEGORY_IDS.includes(raw.category as CategoryId)) {
    fail(slug, `"category" must be one of ${CATEGORY_IDS.join(', ')} (got "${raw.category}")`);
  }

  // Price is optional (a product can list before it's priced) but if present it
  // must be complete, so we never try to charge an ambiguous amount.
  let price: ProductPrice | undefined;
  if (raw.price && Object.keys(raw.price).length > 0) {
    const p = raw.price;
    if (typeof p.unitAmountCents !== 'number' || !Number.isInteger(p.unitAmountCents) || p.unitAmountCents <= 0) {
      fail(slug, '"price.unitAmountCents" must be a positive whole number of euro cents');
    }
    const minQuantity =
      typeof p.minQuantity === 'number' && Number.isInteger(p.minQuantity) && p.minQuantity >= 1
        ? p.minQuantity
        : 1;
    price = {
      unitAmountCents: p.unitAmountCents,
      minQuantity,
      unitLabel: typeof p.unitLabel === 'string' && p.unitLabel.trim() ? p.unitLabel : 'per unit',
    };
  }

  return {
    slug,
    name: str(slug, raw, 'name'),
    category: raw.category as CategoryId,
    tagline: str(slug, raw, 'tagline'),
    description: str(slug, raw, 'description'),
    priceLabel: str(slug, raw, 'priceLabel'),
    price,
    material: str(slug, raw, 'material'),
    orientationNote: str(slug, raw, 'orientationNote'),
    width_mm: num(slug, raw, 'width_mm'),
    height_mm: num(slug, raw, 'height_mm'),
    dpi: num(slug, raw, 'dpi'),
    bleed_mm: num(slug, raw, 'bleed_mm'),
    tone: str(slug, raw, 'tone'),
    image: typeof raw.image === 'string' && raw.image.trim() ? raw.image : undefined,
    order: typeof raw.order === 'number' && Number.isFinite(raw.order) ? raw.order : 100,
    templates: [],
  };
}

// Eager glob = synchronous at build. Every JSON file under content/products is
// a catalogue entry. Adding a file (via the CMS or by hand) adds a product.
const modules = import.meta.glob<{ default: RawProduct }>('./catalog/*.json', {
  eager: true,
});

function loadProducts(): Product[] {
  const loaded = Object.entries(modules).map(([path, mod]) => {
    const slug = slugFromPath(path);
    const product = normalize(slug, mod.default);
    const templates = templatesBySlug[slug];
    product.templates = templates && templates.length ? templates : [defaultTemplate(product)];
    return product;
  });

  // Stable order for a stable static build: category order, then the product's
  // own `order`, then name. Independent of filesystem iteration order.
  const categoryRank = (id: CategoryId) => {
    const i = CATEGORY_IDS.indexOf(id);
    return i === -1 ? CATEGORY_IDS.length : i;
  };
  loaded.sort(
    (a, b) =>
      categoryRank(a.category) - categoryRank(b.category) ||
      a.order - b.order ||
      a.name.localeCompare(b.name),
  );
  return loaded;
}

export const products: Product[] = loadProducts();

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
