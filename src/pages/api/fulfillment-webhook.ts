// POST /api/fulfillment-webhook — receive fulfillment status from the supplier.
//
// The print provider (Gelato) calls this as an order moves through production
// and shipping. We map the provider status to our normalized FulfillmentStatus,
// update the stored order, and — on customer-relevant milestones (in
// production / shipped / delivered / canceled) — email the customer. This is
// the "status visible to the customer" half of the MEI-5 loop.
//
// Auth: a shared secret in the `x-fulfillment-secret` header, matched against
// FULFILLMENT_WEBHOOK_SECRET. Fails CLOSED (503) if the secret isn't configured
// and (401) if it doesn't match — never processes an unauthenticated update.
//
// Gelato's `order_status_updated` payload carries `orderReferenceId` (our order
// id) and `fulfillmentStatus`; shipment events add tracking fields. We read
// them defensively so a payload-shape change degrades to "status only".

import type { APIRoute } from 'astro';
import { normalizeGelatoStatus } from '../../lib/fulfillment';
import { applyFulfillmentUpdate } from '../../lib/order-flow';

export const prerender = false;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  const secret = process.env.FULFILLMENT_WEBHOOK_SECRET;
  if (!secret) {
    return json({ error: 'Fulfillment webhook secret not configured.' }, 503);
  }
  if (request.headers.get('x-fulfillment-secret') !== secret) {
    return json({ error: 'Unauthorized.' }, 401);
  }

  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400);
  }

  const orderId = typeof payload.orderReferenceId === 'string' ? payload.orderReferenceId : null;
  const rawStatus = typeof payload.fulfillmentStatus === 'string' ? payload.fulfillmentStatus : null;
  if (!orderId || !rawStatus) {
    // Nothing actionable (e.g. a heartbeat or an event we don't track).
    return json({ received: true, ignored: true });
  }

  const status = normalizeGelatoStatus(rawStatus);
  const trackingCode = typeof payload.trackingCode === 'string' ? payload.trackingCode : null;
  const trackingUrl = typeof payload.trackingUrl === 'string' ? payload.trackingUrl : null;
  const carrier = typeof payload.shipmentMethodName === 'string' ? payload.shipmentMethodName : null;
  const tracking =
    trackingCode || trackingUrl ? { carrier, code: trackingCode, url: trackingUrl } : null;

  const order = await applyFulfillmentUpdate(orderId, status, new Date().toISOString(), tracking);
  if (!order) {
    // Unknown order — ack anyway so the provider doesn't retry forever.
    console.warn(`[fulfillment-webhook] no order for ${orderId}`);
    return json({ received: true, matched: false });
  }

  console.log(`[fulfillment-webhook] order ${orderId} → ${status}`);
  return json({ received: true, matched: true, status });
};
