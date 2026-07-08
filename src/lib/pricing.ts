// Meish Printed — pricing layer (MEI-4 money path).
//
// Since MEI-18 the machine price lives ON the product, in its editable JSON
// (src/data/catalog/<slug>.json → `price: { unitAmountCents, minQuantity,
// unitLabel }`). That makes the admin-set charge and the human `priceLabel` a
// single source of truth a non-technical admin edits in the /admin CMS — no
// more parallel price table to keep in sync.
//
// This module stays the checkout-facing façade: it joins a catalogue product
// with its price and exposes the exact shapes the cart and /api/checkout use.
// Amounts are euro cents.
//
// ⚠️ PRICES ARE STILL PROVISIONAL until the CEO confirms final pricing and any
// quantity tiers before we charge live cards (see MEI-4). Editing them is now a
// content change in the CMS, not a code change.

import { getProduct as getCatalogueProduct, products, type Product } from '../data/products';

const CURRENCY = 'eur' as const;

export interface Price {
  /** Price per unit, euro cents. */
  unitAmountCents: number;
  currency: typeof CURRENCY;
  /** Minimum order quantity (restaurant items print in runs). */
  minQuantity: number;
  /** Short unit label shown in the cart, e.g. "per print" / "per unit". */
  unitLabel: string;
}

export function getPrice(slug: string): Price | undefined {
  const product = getCatalogueProduct(slug);
  if (!product?.price) return undefined;
  return { ...product.price, currency: CURRENCY };
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
  if (!product?.price) return undefined;
  return {
    slug,
    name: product.name,
    price: { ...product.price, currency: CURRENCY },
    product,
  };
}

/** Catalogue rows (with machine prices) for the client cart to render. A
 *  product without a price simply doesn't appear in the cart — it can still
 *  list on the storefront and be reserved. */
export function pricedCatalogue() {
  return products
    .filter((p) => p.price)
    .map((p) => getPricedProduct(p.slug))
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

export function formatPrice(cents: number, currency: string = CURRENCY): string {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}
