// GET /api/order?session_id=cs_... — read an order for the success page.
//
// The webhook is the source of truth, but webhooks can lag (or, in local dev,
// may not be wired up at all). So this endpoint also *reconciles*: if the order
// isn't stored yet but Stripe reports the session as paid, we persist it now.
// Because saveOrder is idempotent by session id, this never conflicts with the
// webhook — whichever runs first wins, the other is a no-op overwrite.
//
// Only paid/complete sessions are ever returned, so an attacker guessing a
// session id learns nothing about an unpaid or pending checkout.

import type { APIRoute } from 'astro';
import { getStripe, orderFromSession, hasStripeKey } from '../../lib/stripe';
import { getOrder } from '../../lib/orders';
import { onOrderPaid } from '../../lib/order-flow';

export const prerender = false;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export const GET: APIRoute = async ({ url }) => {
  const sessionId = url.searchParams.get('session_id');
  if (!sessionId) {
    return json({ error: 'Missing session_id.' }, 400);
  }

  // Fast path: already captured by the webhook.
  const stored = await getOrder(sessionId);
  if (stored) {
    return json({ order: stored });
  }

  if (!hasStripeKey()) {
    return json({ error: 'Order not found.' }, 404);
  }

  // Reconcile from Stripe.
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === 'unpaid') {
      return json({ error: 'Payment not completed.' }, 402);
    }
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
      limit: 100,
      expand: ['data.price.product'],
    });
    // Reconcile → capture, notify, and route to fulfillment. Idempotent, so if
    // the webhook already ran this is a safe no-op that just returns the order.
    const order = await onOrderPaid(orderFromSession(session, lineItems.data), new Date().toISOString());
    return json({ order });
  } catch (err) {
    console.error('[order] reconcile failed:', err);
    return json({ error: 'Order not found.' }, 404);
  }
};
