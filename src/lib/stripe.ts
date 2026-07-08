// Meish Printed — Stripe client + order mapping.
//
// The secret key is read from the environment (never committed). Until the CEO
// provides Stripe test credentials, `getStripe()` throws a clear, actionable
// error instead of failing cryptically — see docs/CHECKOUT.md and .env.example.

import Stripe from 'stripe';
import type { Order, OrderItem } from './orders';

let client: Stripe | null = null;

/** Lazily construct the Stripe client. Throws if the secret key is missing. */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      'STRIPE_SECRET_KEY is not set. Add your Stripe test secret key to .env ' +
        '(see .env.example / docs/CHECKOUT.md).',
    );
  }
  if (!client) {
    // Pin the API version so behaviour is stable across Stripe deploys.
    client = new Stripe(key, { apiVersion: '2025-02-24.acacia' });
  }
  return client;
}

export function hasStripeKey(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

/**
 * Build our persisted `Order` from a completed Stripe Checkout Session and its
 * line items. Used by both the webhook (source of truth) and the success-page
 * reconcile endpoint, so the mapping lives in exactly one place.
 *
 * The design artifact for each line is carried in the Stripe Price/Product
 * metadata we set at checkout time (`artifact`), so it survives to capture.
 */
export function orderFromSession(
  session: Stripe.Checkout.Session,
  lineItems: Stripe.LineItem[],
): Order {
  const items: OrderItem[] = lineItems.map((li) => {
    const price = li.price;
    const product =
      price && typeof price.product === 'object' && !('deleted' in price.product && price.product.deleted)
        ? (price.product as Stripe.Product)
        : null;
    const meta = product?.metadata ?? {};
    return {
      productId: meta.productId ?? product?.id ?? 'unknown',
      name: li.description ?? product?.name ?? 'Item',
      quantity: li.quantity ?? 1,
      unitAmountCents: price?.unit_amount ?? 0,
      artifact: meta.artifact ? meta.artifact : undefined,
    };
  });

  const paymentIntentId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : (session.payment_intent?.id ?? null);

  return {
    id: session.id,
    createdAt: new Date((session.created ?? 0) * 1000).toISOString(),
    status: session.payment_status,
    amountTotalCents: session.amount_total ?? 0,
    currency: session.currency ?? 'eur',
    customer: {
      email: session.customer_details?.email ?? session.customer_email ?? null,
      name: session.customer_details?.name ?? null,
    },
    items,
    stripe: {
      sessionId: session.id,
      paymentIntentId,
    },
  };
}
