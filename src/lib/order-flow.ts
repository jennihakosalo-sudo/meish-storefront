// Meish Printed — post-payment order flow (MEI-5).
//
// One place that runs everything that must happen when an order is paid, so the
// Stripe webhook (source of truth) and the success-page reconcile share the
// exact same behaviour and can both fire safely:
//
//   1. persist the order (idempotent by id),
//   2. email the customer a confirmation + the studio a routing summary — once,
//   3. route the order to print-on-demand fulfillment — once,
//   4. persist the enriched order.
//
// Idempotency is tracked on the order itself (`notifications.confirmationSentAt`
// and `fulfillment.providerOrderId`), so re-delivery of the webhook or a
// success-page refresh never re-emails or double-submits.

import type { FulfillmentStatus, Order } from './orders';
import { getOrder, saveOrder } from './orders';
import { routeOrderToFulfillment } from './fulfillment';
import {
  buildOrderConfirmationEmail,
  buildOrderStatusEmail,
  buildStudioOrderNotifyEmail,
  sendEmail,
} from './email';

/** Merge a freshly-built order with any side-effect state we already recorded. */
function mergeWithStored(incoming: Order, stored: Order | null): Order {
  if (!stored) {
    return {
      ...incoming,
      fulfillment: incoming.fulfillment ?? null,
      notifications: incoming.notifications ?? { confirmationSentAt: null },
    };
  }
  // Preserve fulfillment + notification history; take fresh payment/customer
  // facts from `incoming` (Stripe is authoritative for those).
  return {
    ...incoming,
    fulfillment: stored.fulfillment ?? incoming.fulfillment ?? null,
    notifications: stored.notifications ??
      incoming.notifications ?? { confirmationSentAt: null },
  };
}

/**
 * Run the paid-order flow. Returns the persisted, enriched order. `now` is
 * injected (ISO string) so callers/tests control the clock.
 */
export async function onOrderPaid(incoming: Order, now: string): Promise<Order> {
  const stored = await getOrder(incoming.id);
  const order = mergeWithStored(incoming, stored);

  // Only paid orders trigger notifications + fulfillment. Persist regardless so
  // an unpaid/pending session is still recorded.
  await saveOrder(order);
  if (order.status !== 'paid') return order;

  // 1. One-time confirmation (customer) + routing summary (studio). We route to
  //    fulfillment first so the studio email can report where the order went.
  const needsNotify = !order.notifications?.confirmationSentAt;

  // 2. Route to fulfillment — idempotent inside routeOrderToFulfillment.
  order.fulfillment = await routeOrderToFulfillment(order, now);
  await saveOrder(order);

  if (needsNotify) {
    const email = order.customer.email;
    if (email) await sendEmail(buildOrderConfirmationEmail(order));
    await sendEmail(buildStudioOrderNotifyEmail(order));
    order.notifications = { confirmationSentAt: now };
    // The confirmation covers the initial (submitted/needs_artwork) state, so
    // record it as the last-notified status to avoid an immediate duplicate.
    if (order.fulfillment) order.fulfillment.notifiedStatus = order.fulfillment.status;
    await saveOrder(order);
  }

  return order;
}

/** Statuses worth emailing the customer about (skip the initial submit noise). */
const NOTIFY_STATUSES: FulfillmentStatus[] = ['in_production', 'shipped', 'delivered', 'canceled'];

/**
 * Apply a fulfillment status update from the provider webhook: update the
 * stored order and, if the status advanced to a customer-relevant milestone
 * not yet notified, email them. Returns the updated order, or null if unknown.
 */
export async function applyFulfillmentUpdate(
  orderId: string,
  status: FulfillmentStatus,
  now: string,
  tracking?: { carrier: string | null; code: string | null; url: string | null } | null,
): Promise<Order | null> {
  const order = await getOrder(orderId);
  if (!order || !order.fulfillment) return null;

  order.fulfillment.status = status;
  order.fulfillment.updatedAt = now;
  if (tracking) order.fulfillment.tracking = tracking;
  await saveOrder(order);

  if (
    NOTIFY_STATUSES.includes(status) &&
    order.fulfillment.notifiedStatus !== status &&
    order.customer.email
  ) {
    await sendEmail(buildOrderStatusEmail(order, status));
    order.fulfillment.notifiedStatus = status;
    await saveOrder(order);
  }

  return order;
}
