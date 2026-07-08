// Meish Printed — print-on-demand fulfillment (MEI-5).
//
// Closes the design → pay → *fulfilled* loop: once an order is paid, we route
// it to a print-on-demand supplier with the print file, then track its status
// back to the customer.
//
// PROVIDER = Gelato (see docs/FULFILLMENT.md for the evaluation vs Printful /
// Printify). Gelato prints locally in the EU + globally, which suits an EU
// paper-goods studio (posters, cards, placemats) on shipping cost and speed,
// and exposes one clean Order API. The provider sits behind this module's
// interface, so switching to Printful/Printify is a one-file swap — nothing
// else in the app calls a provider directly.
//
// Keyless-degrade, exactly like Stripe (docs/CHECKOUT.md) and email (MEI-20):
//   • GELATO_API_KEY set  → submit the order to Gelato for real.
//   • unset               → DRY-RUN: the exact request we *would* POST is
//     written to .data/fulfillment/ and logged, and a synthetic provider order
//     id is returned. This proves the whole loop locally with zero secrets;
//     real submission is then a drop-in once the studio provisions the key.

import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import type { Fulfillment, FulfillmentStatus, Order, ShippingAddress } from './orders';

/* --- Provider selection --------------------------------------------------- */

export function hasFulfillmentProvider(): boolean {
  return Boolean(process.env.GELATO_API_KEY) && providerName() === 'gelato';
}

/** 'gelato' when a key is present and not explicitly disabled; else 'dry-run'. */
export function providerName(): string {
  const forced = process.env.FULFILLMENT_PROVIDER?.trim();
  if (forced === 'dry-run') return 'dry-run';
  if (forced) return forced;
  return process.env.GELATO_API_KEY ? 'gelato' : 'dry-run';
}

/* --- Product → Gelato mapping --------------------------------------------
   Each catalogue slug maps to a Gelato product UID (size, paper, coating, …).
   These are PLACEHOLDERS shaped like real Gelato poster/card UIDs and MUST be
   confirmed against the studio's Gelato catalogue before live orders — a wrong
   UID prints the wrong product. Override any entry (or add SKUs for new
   products) without a code change via FULFILLMENT_SKU_MAP, a JSON object of
   { "<slug>": "<productUid>" }. A slug with no mapping can't be auto-routed;
   its order is flagged `needs_artwork` for the studio to place by hand. */
const DEFAULT_SKU_MAP: Record<string, string> = {
  'atelier-poster':
    'posters_pf_50x70-cm_pt_170-gsm-coated-silk_cl_4-0_ver',
  'verse-quote-print':
    'posters_pf_30x40-cm_pt_170-gsm-coated-silk_cl_4-0_ver',
  'menu-card':
    'cards_pf_a5_pt_350-gsm-coated-silk_cl_4-4_ct_none_prt_none_hor',
  // enamel-tin-plate, paper-coaster, table-placemat: no Gelato equivalent yet —
  // these route to needs_artwork (bespoke / specialist supplier, see MEI-27).
};

function skuMap(): Record<string, string> {
  const override = process.env.FULFILLMENT_SKU_MAP;
  if (!override) return DEFAULT_SKU_MAP;
  try {
    return { ...DEFAULT_SKU_MAP, ...(JSON.parse(override) as Record<string, string>) };
  } catch {
    console.error('[fulfillment] FULFILLMENT_SKU_MAP is not valid JSON; using defaults.');
    return DEFAULT_SKU_MAP;
  }
}

export function gelatoProductUid(slug: string): string | undefined {
  return skuMap()[slug];
}

/* --- Print-file resolution ------------------------------------------------
   Gelato needs a downloadable print-ready file URL per item. Today the line
   item's `artifact` is free text OR an artwork URL (the studio → cart handoff
   that passes a real exported file is MEI-24). So: an http(s) artifact is used
   as the print file; anything else is a note → the item needs the studio to
   art it up (needs_artwork). This is honest about the current gap and still
   auto-routes the moment MEI-24 lands a file URL. */
function resolvePrintFileUrl(artifact: string | undefined): string | null {
  if (!artifact) return null;
  const trimmed = artifact.trim();
  if (/^https:\/\/\S+$/i.test(trimmed)) return trimmed;
  return null;
}

/* --- Status mapping ------------------------------------------------------- */

/** Map a Gelato fulfillmentStatus to our normalized FulfillmentStatus. */
export function normalizeGelatoStatus(raw: string): FulfillmentStatus {
  switch (raw) {
    case 'created':
    case 'passed':
      return 'submitted';
    case 'printed':
    case 'in_production':
    case 'packed':
      return 'in_production';
    case 'shipped':
      return 'shipped';
    case 'delivered':
      return 'delivered';
    case 'canceled':
    case 'cancelled':
      return 'canceled';
    case 'failed':
      return 'failed';
    default:
      return 'submitted';
  }
}

/* --- Request building ----------------------------------------------------- */

interface GelatoItem {
  itemReferenceId: string;
  productUid: string;
  files: Array<{ type: 'default'; url: string }>;
  quantity: number;
}

interface GelatoOrderRequest {
  orderType: 'order';
  orderReferenceId: string;
  customerReferenceId: string;
  currency: string;
  items: GelatoItem[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    postCode: string;
    state: string;
    country: string;
    email: string;
    phone: string;
  };
}

interface BuiltRequest {
  request: GelatoOrderRequest | null;
  itemsResolution: Fulfillment['items'];
  /** Non-empty when the order can't be routed as-is. */
  blockers: string[];
}

function splitName(full: string | null): { first: string; last: string } {
  const name = (full ?? '').trim();
  if (!name) return { first: 'Meish', last: 'Customer' };
  const parts = name.split(/\s+/);
  if (parts.length === 1) return { first: parts[0], last: parts[0] };
  return { first: parts[0], last: parts.slice(1).join(' ') };
}

/** Build the provider request from an order, resolving each line's print file. */
export function buildFulfillmentRequest(order: Order): BuiltRequest {
  const blockers: string[] = [];
  const itemsResolution: Fulfillment['items'] = [];
  const gelatoItems: GelatoItem[] = [];

  order.items.forEach((it, i) => {
    const printFileUrl = resolvePrintFileUrl(it.artifact);
    const productUid = gelatoProductUid(it.productId);
    const needsManualArt = !printFileUrl || !productUid;
    itemsResolution.push({ productId: it.productId, printFileUrl, needsManualArt });

    if (!printFileUrl) {
      blockers.push(`${it.name}: no print-ready file (artifact is a note, not a URL).`);
    }
    if (!productUid) {
      blockers.push(`${it.name}: no Gelato product mapping for "${it.productId}".`);
    }
    if (printFileUrl && productUid) {
      gelatoItems.push({
        itemReferenceId: `${order.id}-${i}`,
        productUid,
        files: [{ type: 'default', url: printFileUrl }],
        quantity: it.quantity,
      });
    }
  });

  const addr: ShippingAddress | null = order.shipping?.address ?? null;
  if (!addr || !addr.line1 || !addr.city || !addr.postalCode || !addr.country) {
    blockers.push('No complete shipping address on the order.');
  }
  if (!order.customer.email) {
    blockers.push('No customer email on the order.');
  }

  if (blockers.length > 0) {
    return { request: null, itemsResolution, blockers };
  }

  const { first, last } = splitName(order.shipping?.name ?? order.customer.name);
  const request: GelatoOrderRequest = {
    orderType: 'order',
    orderReferenceId: order.id,
    customerReferenceId: order.customer.email ?? order.id,
    currency: order.currency.toUpperCase(),
    items: gelatoItems,
    shippingAddress: {
      firstName: first,
      lastName: last,
      addressLine1: addr!.line1!,
      addressLine2: addr!.line2 ?? '',
      city: addr!.city!,
      postCode: addr!.postalCode!,
      state: addr!.state ?? '',
      country: addr!.country!,
      email: order.customer.email!,
      phone: '',
    },
  };
  return { request, itemsResolution, blockers: [] };
}

/* --- Submission ----------------------------------------------------------- */

const GELATO_ORDERS_URL = 'https://order.gelatoapis.com/v4/orders';

function fulfillmentDir(): string {
  return resolve(process.env.FULFILLMENT_DIR ?? '.data/fulfillment');
}

interface SubmitOutcome {
  ok: boolean;
  providerOrderId: string | null;
  status: FulfillmentStatus;
  error: string | null;
}

/** Submit to Gelato, or capture the request in DRY-RUN. Never throws. */
async function submit(order: Order, request: GelatoOrderRequest): Promise<SubmitOutcome> {
  if (hasFulfillmentProvider()) {
    try {
      const res = await fetch(GELATO_ORDERS_URL, {
        method: 'POST',
        headers: {
          'X-API-KEY': process.env.GELATO_API_KEY as string,
          'content-type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      if (!res.ok) {
        const body = await res.text();
        console.error('[fulfillment] gelato submit failed:', res.status, body);
        return { ok: false, providerOrderId: null, status: 'failed', error: `gelato_${res.status}` };
      }
      const body = (await res.json()) as { id?: string; fulfillmentStatus?: string };
      return {
        ok: true,
        providerOrderId: body.id ?? null,
        status: body.fulfillmentStatus ? normalizeGelatoStatus(body.fulfillmentStatus) : 'submitted',
        error: null,
      };
    } catch (err) {
      console.error('[fulfillment] gelato submit threw:', err);
      return { ok: false, providerOrderId: null, status: 'failed', error: 'network' };
    }
  }

  // DRY-RUN — capture what we would have sent.
  const file = `${order.id.replace(/[^a-zA-Z0-9_-]/g, '_')}.json`;
  try {
    await mkdir(fulfillmentDir(), { recursive: true });
    await writeFile(
      join(fulfillmentDir(), file),
      JSON.stringify({ endpoint: GELATO_ORDERS_URL, request }, null, 2),
      'utf8',
    );
    console.log(`[fulfillment] DRY-RUN (no GELATO_API_KEY): wrote ${file}`);
  } catch (err) {
    console.error('[fulfillment] dry-run write failed:', err);
    return { ok: false, providerOrderId: null, status: 'failed', error: 'dryrun_write' };
  }
  // Deterministic synthetic id so re-runs stay idempotent (no Date/random).
  return { ok: true, providerOrderId: `dry_${order.id}`, status: 'submitted', error: null };
}

/**
 * Route a paid order to fulfillment and return its Fulfillment record. Safe to
 * call more than once: if the order was already submitted (has a providerOrderId
 * and a non-failed status), the existing record is returned unchanged — so the
 * Stripe webhook and the success-page reconcile never double-submit.
 */
export async function routeOrderToFulfillment(order: Order, now: string): Promise<Fulfillment> {
  const existing = order.fulfillment ?? null;
  if (existing?.providerOrderId && existing.status !== 'failed') {
    return existing;
  }

  const { request, itemsResolution, blockers } = buildFulfillmentRequest(order);

  if (!request) {
    // Can't auto-route (missing print file, SKU, or address). Not an error —
    // the studio produces the file / places it manually. Surface it clearly.
    console.log(`[fulfillment] order ${order.id} needs manual handling: ${blockers.join(' ')}`);
    return {
      provider: providerName(),
      status: 'needs_artwork',
      providerOrderId: null,
      submittedAt: null,
      updatedAt: now,
      tracking: null,
      items: itemsResolution,
      error: blockers.join(' '),
      notifiedStatus: existing?.notifiedStatus ?? null,
    };
  }

  const outcome = await submit(order, request);
  return {
    provider: providerName(),
    status: outcome.status,
    providerOrderId: outcome.providerOrderId,
    submittedAt: outcome.ok ? now : null,
    updatedAt: now,
    tracking: null,
    items: itemsResolution,
    error: outcome.error,
    notifiedStatus: existing?.notifiedStatus ?? null,
  };
}
