// GET /api/dev-fulfillment-check — DEV-ONLY proof of the MEI-5 loop.
//
// Runs the REAL post-payment flow (src/lib/order-flow.ts → fulfillment + email)
// against synthetic paid orders, with no Stripe/Gelato/Resend keys, so the
// whole design→pay→fulfilled loop can be proven locally exactly like the
// keyless reserve/checkout proofs. It is compiled OUT of production builds
// (guarded by import.meta.env.DEV → 404), so it ships nothing.
//
// It exercises two orders:
//   • demo-routable   — artifact is a print-file URL + a mapped product, so it
//     auto-routes: a Gelato request is captured to .data/fulfillment and the
//     status becomes `submitted`. Then a simulated `shipped` webhook advances
//     it and emails the customer.
//   • demo-needs-art  — artifact is a plain note, so it routes to `needs_artwork`
//     for the studio (proving the honest fallback for today's free-text handoff).

import type { APIRoute } from 'astro';
import type { Order } from '../../lib/orders';
import { onOrderPaid, applyFulfillmentUpdate } from '../../lib/order-flow';

export const prerender = false;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function baseOrder(id: string, artifact: string): Order {
  return {
    id,
    createdAt: '2026-07-09T00:00:00.000Z',
    status: 'paid',
    amountTotalCents: 4800,
    currency: 'eur',
    customer: { email: 'demo-buyer@example.com', name: 'Demo Buyer' },
    shipping: {
      name: 'Demo Buyer',
      address: {
        line1: 'Kalevankatu 1',
        line2: null,
        city: 'Helsinki',
        state: null,
        postalCode: '00100',
        country: 'FI',
      },
    },
    items: [
      {
        productId: 'atelier-poster',
        name: 'Atelier',
        quantity: 1,
        unitAmountCents: 4800,
        artifact,
      },
    ],
    stripe: { sessionId: id, paymentIntentId: 'pi_demo' },
    fulfillment: null,
    notifications: { confirmationSentAt: null },
  };
}

export const GET: APIRoute = async () => {
  if (!import.meta.env.DEV) {
    return json({ error: 'Not found.' }, 404);
  }

  const now = '2026-07-09T00:00:00.000Z';

  // 1. Routable order (print-file URL) → auto-route to fulfillment (DRY-RUN).
  const routable = await onOrderPaid(
    baseOrder('cs_test_fulfillment_demo', 'https://files.meish.work/demo/atelier-dawn-50x70.pdf'),
    now,
  );

  // 2. Simulate the provider status webhook advancing it to shipped + tracking.
  const shipped = await applyFulfillmentUpdate('cs_test_fulfillment_demo', 'shipped', now, {
    carrier: 'PostNord',
    code: 'LX123456789FI',
    url: 'https://tracking.example/LX123456789FI',
  });

  // 3. Idempotency check — re-running capture must NOT re-submit or re-email.
  const rerun = await onOrderPaid(
    baseOrder('cs_test_fulfillment_demo', 'https://files.meish.work/demo/atelier-dawn-50x70.pdf'),
    '2026-07-09T01:00:00.000Z',
  );

  // 4. Note-only order → needs_artwork fallback.
  const needsArt = await onOrderPaid(
    baseOrder('cs_test_fulfillment_needsart', 'A quote: "the kitchen at dawn" — please typeset'),
    now,
  );

  return json({
    ok: true,
    routable: {
      fulfillmentStatus: routable.fulfillment?.status,
      provider: routable.fulfillment?.provider,
      providerOrderId: routable.fulfillment?.providerOrderId,
      confirmationSentAt: routable.notifications?.confirmationSentAt,
    },
    afterShippedWebhook: {
      fulfillmentStatus: shipped?.fulfillment?.status,
      tracking: shipped?.fulfillment?.tracking,
      notifiedStatus: shipped?.fulfillment?.notifiedStatus,
    },
    idempotentRerun: {
      providerOrderId: rerun.fulfillment?.providerOrderId,
      confirmationSentAt: rerun.notifications?.confirmationSentAt,
      note: 'providerOrderId + confirmationSentAt should match the first run',
    },
    needsArtwork: {
      fulfillmentStatus: needsArt.fulfillment?.status,
      reason: needsArt.fulfillment?.error,
    },
  });
};
