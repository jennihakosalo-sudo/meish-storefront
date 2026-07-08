// POST /api/stripe-webhook — capture paid orders (source of truth).
//
// Stripe calls this after a successful payment. We verify the signature with
// STRIPE_WEBHOOK_SECRET, then on `checkout.session.completed` we retrieve the
// session's line items (with the product metadata that carries the design
// artifact) and persist the order. Persisting is idempotent by session id, so
// Stripe's automatic retries never create duplicate orders.

import type { APIRoute } from 'astro';
import { getStripe } from '../../lib/stripe';
import { orderFromSession } from '../../lib/stripe';
import { onOrderPaid } from '../../lib/order-flow';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return new Response('Webhook secret not configured.', { status: 503 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return new Response('Missing stripe-signature header.', { status: 400 });
  }

  const stripe = getStripe();
  // Signature verification needs the exact raw bytes, not a parsed body.
  const rawBody = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    console.error('[webhook] signature verification failed:', (err as Error).message);
    return new Response(`Webhook signature verification failed.`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        limit: 100,
        expand: ['data.price.product'],
      });
      // Capture, notify, and route to fulfillment (idempotent — Stripe retries
      // and the success-page reconcile both land here safely). MEI-5.
      const order = await onOrderPaid(orderFromSession(session, lineItems.data), new Date().toISOString());
      console.log(
        `[webhook] captured order ${session.id} (${session.payment_status}) → fulfillment ${order.fulfillment?.status}`,
      );
    } catch (err) {
      console.error('[webhook] failed to capture order:', err);
      // 500 → Stripe retries later, so a transient store failure isn't lost.
      return new Response('Failed to capture order.', { status: 500 });
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};
