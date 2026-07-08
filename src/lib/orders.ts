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
  items: OrderItem[];
  stripe: {
    sessionId: string;
    paymentIntentId: string | null;
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
