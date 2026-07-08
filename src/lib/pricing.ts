// Meish Printed — pricing layer (MEI-4 money path).
//
// The catalogue in src/data/products.ts (owned by the design-tool task, MEI-3)
// carries only human price *labels* like "from €24" / "from €0.40 / unit" — the
// right thing for a storefront, but not something you can charge a card for.
// Checkout needs an exact integer amount and a minimum quantity per product.
//
// This module is the single, machine-readable price source, keyed by the real
// catalogue slug. Amounts are euro cents.
//
// ⚠️ PLACEHOLDER PRICES — these mirror the current "from €X" labels and are the
// MVP defaults so we can take a first real (test) payment. The CEO must confirm
// final prices and any quantity tiers before we charge live cards (see the
// escalation on issue MEI-4). Changing a price here is the only edit needed.

import { getProduct as getCatalogueProduct, type Product } from '../data/products';

export interface Price {
  /** Price per unit, euro cents. */
  unitAmountCents: number;
  currency: 'eur';
  /** Minimum order quantity (restaurant items print in runs). */
  minQuantity: number;
  /** Short unit label shown in the cart, e.g. "per print" / "per unit". */
  unitLabel: string;
}

const PRICES: Record<string, Price> = {
  'verse-quote-print': { unitAmountCents: 2400, currency: 'eur', minQuantity: 1, unitLabel: 'per print' },
  'atelier-poster': { unitAmountCents: 4800, currency: 'eur', minQuantity: 1, unitLabel: 'per print' },
  'enamel-tin-plate': { unitAmountCents: 1800, currency: 'eur', minQuantity: 1, unitLabel: 'per plate' },
  'table-placemat': { unitAmountCents: 40, currency: 'eur', minQuantity: 250, unitLabel: 'per unit' },
  'paper-coaster': { unitAmountCents: 15, currency: 'eur', minQuantity: 500, unitLabel: 'per unit' },
  'menu-card': { unitAmountCents: 30, currency: 'eur', minQuantity: 250, unitLabel: 'per unit' },
};

export function getPrice(slug: string): Price | undefined {
  return PRICES[slug];
}

/** A product joined with its price — the shape checkout and the cart both use. */
export interface PricedProduct {
  slug: string;
  name: string;
  price: Price;
  product: Product;
}

export function getPricedProduct(slug: string): PricedProduct | undefined {
  const product = getCatalogueProduct(slug);
  const price = getPrice(slug);
  if (!product || !price) return undefined;
  return { slug, name: product.name, price, product };
}

/** Catalogue rows (with machine prices) for the client cart to render. */
export function pricedCatalogue() {
  return Object.keys(PRICES)
    .map((slug) => getPricedProduct(slug))
    .filter((p): p is PricedProduct => Boolean(p))
    .map((p) => ({
      id: p.slug,
      name: p.name,
      priceCents: p.price.unitAmountCents,
      currency: p.price.currency,
      unit: p.price.unitLabel,
      minQuantity: p.price.minQuantity,
      customizable: true,
    }));
}

export function formatPrice(cents: number, currency: string = 'eur'): string {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}
