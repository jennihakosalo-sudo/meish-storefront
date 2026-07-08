// Meish Printed — client-side cart.
//
// The cart lives in localStorage so it survives navigation without any server
// state (the storefront pages stay static). This one module, included on every
// page via the Base layout, does three declarative things:
//   1. keeps every [data-cart-count] badge in sync,
//   2. wires <form data-add-to-cart> on the shop,
//   3. renders + drives [data-cart-root] on the cart page (incl. checkout).
//
// Money is only ever computed for *display* here; the authoritative amount is
// recomputed server-side from the catalogue in /api/checkout.

const STORAGE_KEY = 'meish.cart.v1';

interface CartLine {
  id: string;
  quantity: number;
  artifact?: string;
}

interface CatalogueEntry {
  id: string;
  name: string;
  priceCents: number;
  currency: string;
  unit: string;
  customizable: boolean;
}

function readCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((l) => l && typeof l.id === 'string' && Number(l.quantity) > 0);
  } catch {
    return [];
  }
}

function writeCart(lines: CartLine[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  window.dispatchEvent(new CustomEvent('meish:cart-changed'));
}

function totalCount(lines: CartLine[]): number {
  return lines.reduce((n, l) => n + l.quantity, 0);
}

function addLine(id: string, quantity: number, artifact?: string): void {
  const lines = readCart();
  // Customisable lines are unique per artifact; others merge by id.
  const existing = lines.find((l) => l.id === id && (l.artifact ?? '') === (artifact ?? ''));
  if (existing) {
    existing.quantity += quantity;
  } else {
    lines.push({ id, quantity, ...(artifact ? { artifact } : {}) });
  }
  writeCart(lines);
}

function formatPrice(cents: number, currency: string): string {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

function syncBadges(): void {
  const count = totalCount(readCart());
  document.querySelectorAll<HTMLElement>('[data-cart-count]').forEach((el) => {
    el.textContent = String(count);
    el.hidden = count === 0;
  });
}

function readCatalogue(): Map<string, CatalogueEntry> {
  const el = document.getElementById('meish-catalogue');
  const map = new Map<string, CatalogueEntry>();
  if (!el?.textContent) return map;
  try {
    for (const p of JSON.parse(el.textContent) as CatalogueEntry[]) map.set(p.id, p);
  } catch {
    /* ignore malformed catalogue */
  }
  return map;
}

function wireAddToCart(): void {
  document.querySelectorAll<HTMLFormElement>('form[data-add-to-cart]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = form.dataset.productId!;
      const qtyInput = form.querySelector<HTMLInputElement>('[name="quantity"]');
      const artifactInput = form.querySelector<HTMLTextAreaElement>('[name="artifact"]');
      const quantity = Math.max(1, Math.floor(Number(qtyInput?.value) || 1));
      const artifact = artifactInput?.value.trim() || undefined;

      if (form.dataset.customizable === 'true' && !artifact) {
        artifactInput?.setCustomValidity('Tell us what to print first.');
        artifactInput?.reportValidity();
        return;
      }
      artifactInput?.setCustomValidity('');

      addLine(id, quantity, artifact);
      if (artifactInput) artifactInput.value = '';

      const btn = form.querySelector<HTMLButtonElement>('[type="submit"]');
      if (btn) {
        const original = btn.textContent;
        btn.textContent = 'Added ✓';
        btn.disabled = true;
        window.setTimeout(() => {
          btn.textContent = original;
          btn.disabled = false;
        }, 1400);
      }
    });
  });
}

function renderCart(root: HTMLElement): void {
  const catalogue = readCatalogue();
  const lines = readCart();

  const itemsEl = root.querySelector<HTMLElement>('[data-cart-items]')!;
  const emptyEl = root.querySelector<HTMLElement>('[data-cart-empty]')!;
  const summaryEl = root.querySelector<HTMLElement>('[data-cart-summary]')!;
  const totalEl = root.querySelector<HTMLElement>('[data-cart-total]')!;

  if (lines.length === 0) {
    itemsEl.innerHTML = '';
    emptyEl.hidden = false;
    summaryEl.hidden = true;
    return;
  }
  emptyEl.hidden = true;
  summaryEl.hidden = false;

  let total = 0;
  itemsEl.innerHTML = '';
  lines.forEach((line, index) => {
    const p = catalogue.get(line.id);
    if (!p) return;
    const lineTotal = p.priceCents * line.quantity;
    total += lineTotal;

    const row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML = `
      <div class="cart-row__main">
        <h3 class="cart-row__name">${escapeHtml(p.name)}</h3>
        <p class="cart-row__meta">${formatPrice(p.priceCents, p.currency)} ${escapeHtml(p.unit)}</p>
        ${line.artifact ? `<p class="cart-row__artifact"><span class="eyebrow">To print</span> ${escapeHtml(line.artifact)}</p>` : ''}
      </div>
      <div class="cart-row__qty">
        <button type="button" class="qty-btn" data-dec aria-label="Decrease quantity">−</button>
        <span class="qty-value" aria-live="polite">${line.quantity}</span>
        <button type="button" class="qty-btn" data-inc aria-label="Increase quantity">+</button>
      </div>
      <div class="cart-row__price">${formatPrice(lineTotal, p.currency)}</div>
      <button type="button" class="cart-row__remove" data-remove aria-label="Remove ${escapeHtml(p.name)}">Remove</button>
    `;
    row.querySelector('[data-inc]')!.addEventListener('click', () => changeQty(index, +1));
    row.querySelector('[data-dec]')!.addEventListener('click', () => changeQty(index, -1));
    row.querySelector('[data-remove]')!.addEventListener('click', () => removeAt(index));
    itemsEl.appendChild(row);
  });

  const currency = catalogue.get(lines[0].id)?.currency ?? 'eur';
  totalEl.textContent = formatPrice(total, currency);
}

function changeQty(index: number, delta: number): void {
  const lines = readCart();
  if (!lines[index]) return;
  lines[index].quantity = Math.max(1, lines[index].quantity + delta);
  writeCart(lines);
}

function removeAt(index: number): void {
  const lines = readCart();
  lines.splice(index, 1);
  writeCart(lines);
}

async function startCheckout(button: HTMLButtonElement): Promise<void> {
  const lines = readCart();
  if (lines.length === 0) return;
  button.disabled = true;
  const original = button.textContent;
  button.textContent = 'Redirecting to secure checkout…';

  const errEl = document.querySelector<HTMLElement>('[data-cart-error]');
  if (errEl) errEl.hidden = true;

  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ items: lines }),
    });
    const data = await res.json();
    if (!res.ok || !data.url) {
      throw new Error(data.error || 'Checkout is temporarily unavailable.');
    }
    window.location.href = data.url;
  } catch (err) {
    if (errEl) {
      errEl.textContent = (err as Error).message;
      errEl.hidden = false;
    }
    button.disabled = false;
    button.textContent = original;
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      default: return '&#39;';
    }
  });
}

function init(): void {
  syncBadges();
  wireAddToCart();

  const root = document.querySelector<HTMLElement>('[data-cart-root]');
  if (root) {
    renderCart(root);
    window.addEventListener('meish:cart-changed', () => renderCart(root));
    const checkoutBtn = root.querySelector<HTMLButtonElement>('[data-checkout]');
    checkoutBtn?.addEventListener('click', () => startCheckout(checkoutBtn));
  }

  window.addEventListener('meish:cart-changed', syncBadges);
  // Reflect changes made in another tab.
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      syncBadges();
      const r = document.querySelector<HTMLElement>('[data-cart-root]');
      if (r) renderCart(r);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
