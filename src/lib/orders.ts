// Meish Printed — order store.
//
// Persists a captured order: who bought, what to print (design artifact),
// how much, and the payment status. This is the "stored order" half of the
// MEI-4 deliverable.
//
// MVP storage = one JSON file per order under ORDERS_DIR (default `.data/orders`).
// That is enough to prove the end-to-end money path and to run the studio's
// first orders. It is intentionally behind this tiny interface so production can
// swap in a hosted store (Vercel Postgres / Cloudflare D1 / a managed DB) by
// re-implementing `saveOrder` / `getOrder` / `listOrders` — nothing else changes.
//
// Writes are idempotent by `id` (we use the Stripe Checkout Session id), so the
// webhook and the success-page reconciliation can both persist the same order
// without creating duplicates.

import { mkdir, readFile, writeFile, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  /** Unit price in euro cents at time of purchase. */
  unitAmountCents: number;
  /** The buyer-supplied design artifact (quote / note / artwork link), if any. */
  artifact?: string;
}

/** A postal shipping address, captured by Stripe Checkout for fulfillment. */
export interface ShippingAddress {
  line1: string | null;
  line2: string | null;
  city: string | null;
  /** State / province / region — often null for EU addresses. */
  state: string | null;
  postalCode: string | null;
  /** ISO 3166-1 alpha-2, e.g. 'FI', 'IE'. */
  country: string | null;
}

/**
 * Where the order goes once paid (MEI-5). Lifecycle:
 *   not_submitted → (routing) → submitted → in_production → shipped → delivered
 * with `needs_artwork` when a print-ready file couldn't be resolved from the
 * line item (so the studio produces/uploads it), and `failed` for a provider
 * submission error that needs a human. `provider` is 'dry-run' until a real
 * fulfillment API key is configured (keyless-degrade, like Stripe/email).
 */
export type FulfillmentStatus =
  | 'not_submitted'
  | 'needs_artwork'
  | 'submitted'
  | 'in_production'
  | 'shipped'
  | 'delivered'
  | 'canceled'
  | 'failed';

export interface Fulfillment {
  provider: string;
  status: FulfillmentStatus;
  /** The provider's order id, once accepted. */
  providerOrderId: string | null;
  submittedAt: string | null;
  updatedAt: string;
  /** Carrier tracking, populated when the provider reports a shipment. */
  tracking: { carrier: string | null; code: string | null; url: string | null } | null;
  /** Per-line print-file resolution — flags items the studio must art up. */
  items: Array<{ productId: string; printFileUrl: string | null; needsManualArt: boolean }>;
  /** Last routing/submission error, if any. */
  error: string | null;
  /** Last fulfillment status the customer was emailed about (dedupe). */
  notifiedStatus: FulfillmentStatus | null;
}

export interface Order {
  /** Our order id — the Stripe Checkout Session id. */
  id: string;
  createdAt: string;
  /** 'paid' | 'unpaid' | 'no_payment_required' — mirrors Stripe payment_status. */
  status: string;
  amountTotalCents: number;
  currency: string;
  customer: {
    email: string | null;
    name: string | null;
  };
  /** Delivery address for fulfillment. Null if Checkout didn't collect one. */
  shipping: {
    name: string | null;
    address: ShippingAddress | null;
  } | null;
  items: OrderItem[];
  stripe: {
    sessionId: string;
    paymentIntentId: string | null;
  };
  /** Fulfillment routing + status (MEI-5). Null until first routed. */
  fulfillment?: Fulfillment | null;
  /** Which post-payment side effects have already run (idempotency). */
  notifications?: {
    /** ISO timestamp the customer order-confirmation email was sent. */
    confirmationSentAt: string | null;
  };
}

function ordersDir(): string {
  return resolve(process.env.ORDERS_DIR ?? '.data/orders');
}

function orderPath(id: string): string {
  // Session ids are `cs_test_...` / `cs_live_...` — filesystem-safe already,
  // but guard against anything unexpected in the id.
  const safe = id.replace(/[^a-zA-Z0-9_-]/g, '_');
  return join(ordersDir(), `${safe}.json`);
}

/** Persist an order. Overwrites any existing order with the same id. */
export async function saveOrder(order: Order): Promise<void> {
  await mkdir(ordersDir(), { recursive: true });
  await writeFile(orderPath(order.id), JSON.stringify(order, null, 2), 'utf8');
}

export async function getOrder(id: string): Promise<Order | null> {
  try {
    const raw = await readFile(orderPath(id), 'utf8');
    return JSON.parse(raw) as Order;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw err;
  }
}

export async function listOrders(): Promise<Order[]> {
  try {
    const files = await readdir(ordersDir());
    const orders = await Promise.all(
      files
        .filter((f) => f.endsWith('.json'))
        .map(async (f) => JSON.parse(await readFile(join(ordersDir(), f), 'utf8')) as Order),
    );
    return orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw err;
  }
}
