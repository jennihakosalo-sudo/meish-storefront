// POST /api/checkout — turn a cart into a Stripe Checkout Session.
//
// Body: { items: [{ id: string, quantity: number, artifact?: string }] }
// Response: { url: string }  → the client redirects the browser there.
//
// Prices are taken from the server-side catalogue, NOT from the client, so the
// amount charged can never be tampered with from the browser. The per-line
// design artifact is stored in the Stripe Product metadata so it survives all
// the way to order capture in the webhook.

import type { APIRoute } from 'astro';
import { getPricedProduct } from '../../lib/pricing';
import { getStripe } from '../../lib/stripe';

export const prerender = false;

interface IncomingItem {
  id?: unknown;
  quantity?: unknown;
  artifact?: unknown;
}

const MAX_QTY = 999;
const MAX_ARTIFACT_LEN = 480; // Stripe metadata values cap at 500 chars.

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  let payload: { items?: IncomingItem[] };
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400);
  }

  const incoming = Array.isArray(payload.items) ? payload.items : [];
  if (incoming.length === 0) {
    return json({ error: 'Your cart is empty.' }, 400);
  }

  const lineItems = [];
  for (const raw of incoming) {
    const priced = typeof raw.id === 'string' ? getPricedProduct(raw.id) : undefined;
    if (!priced) {
      return json({ error: `Unknown product: ${String(raw.id)}` }, 400);
    }
    const quantity = Math.floor(Number(raw.quantity));
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > MAX_QTY) {
      return json({ error: `Invalid quantity for ${priced.name}.` }, 400);
    }
    if (quantity < priced.price.minQuantity) {
      return json(
        { error: `${priced.name} is printed in runs of at least ${priced.price.minQuantity}.` },
        400,
      );
    }
    // Every catalogue item is made to order, so a design artifact is required.
    const artifact =
      typeof raw.artifact === 'string' ? raw.artifact.trim().slice(0, MAX_ARTIFACT_LEN) : '';
    if (artifact.length === 0) {
      return json({ error: `${priced.name} needs a design or note before checkout.` }, 400);
    }

    lineItems.push({
      quantity,
      price_data: {
        currency: priced.price.currency,
        unit_amount: priced.price.unitAmountCents,
        product_data: {
          name: priced.name,
          description: `Print: ${artifact}`,
          // Carried through to order capture (see orderFromSession).
          metadata: {
            productId: priced.slug,
            artifact,
          },
        },
      },
    });
  }

  let stripe;
  try {
    stripe = getStripe();
  } catch (err) {
    // Missing credentials — surface a clean 503 rather than a 500 stack trace.
    return json({ error: (err as Error).message }, 503);
  }

  const origin = process.env.PUBLIC_SITE_URL || new URL(request.url).origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart?canceled=1`,
      // Checkout always collects the buyer's email; captured with the order.
      billing_address_collection: 'auto',
      metadata: { source: 'meish-storefront' },
    });

    if (!session.url) {
      return json({ error: 'Stripe did not return a checkout URL.' }, 502);
    }
    return json({ url: session.url });
  } catch (err) {
    console.error('[checkout] Stripe error:', err);
    return json({ error: 'Could not start checkout. Please try again.' }, 502);
  }
};
