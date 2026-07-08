/* ==========================================================================
   Meish Printed — In-browser design studio  (MEI-3)
   ---------------------------------------------------------------------------
   A dependency-free WYSIWYG editor. Layers are absolutely-positioned DOM
   elements for live editing; on export we replay the same model onto a canvas
   sized to the product's true print resolution to produce a print-ready proof.

   One coordinate space (mm, from the product model) drives two scale factors:
     • stageScale = stage_px / width_mm   → screen preview
     • printScale = dpi / 25.4            → export raster
   Because both read the same layer geometry, what you see is what prints.
   ========================================================================== */

import type { Product, Layer, TextLayer, ImageLayer, FontKey, Align } from '../data/products';

/* --- Bootstrap: read the product model handed over by the page ----------- */

function must<T>(v: T | null, name: string): T {
  if (!v) throw new Error(`meish-editor: required DOM node "${name}" missing`);
  return v;
}
const configEl = must(document.getElementById('product-config'), 'product-config');
const stage = must(document.getElementById('stage'), 'stage');
const stageWrap = must(document.getElementById('stage-wrap'), 'stage-wrap');
const canvasArea = must(document.getElementById('canvas'), 'canvas');
const product: Product = JSON.parse(configEl.textContent || '{}');

/* --- Font mapping (must mirror tokens.css) ------------------------------- */

const FONT_STACK: Record<FontKey, string> = {
  display: `"Fraunces Variable", "Fraunces", Georgia, serif`,
  body: `"Inter Variable", "Inter", system-ui, sans-serif`,
  mono: `"SFMono-Regular", ui-monospace, Menlo, monospace`,
};

const PALETTE = ['#f7f3ec', '#efe9df', '#fffdf9', '#1f1a16', '#b4552d', '#8f4021', '#5c6b57', '#c98a5e'];

/* --- Editor state -------------------------------------------------------- */

interface State {
  background: string;
  layers: Layer[];
  selectedId: string | null;
  activeTemplate: string | null;
}

const state: State = {
  background: product.templates[0]?.background ?? '#f7f3ec',
  layers: [],
  selectedId: null,
  activeTemplate: null,
};

let stageScale = 1; // px per mm on screen
let uidCounter = 0;
const uid = (p: string) => `${p}-${Date.now().toString(36)}-${++uidCounter}`;
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

const layerEls = new Map<string, HTMLElement>();

/* --- Layout: size the stage to fit, keep aspect ratio -------------------- */

function computeStageScale(): number {
  const areaW = canvasArea.clientWidth - 64; // padding breathing room
  const areaH = canvasArea.clientHeight - 96; // leave room for the hint line
  const byW = areaW / product.width_mm;
  const byH = areaH / product.height_mm;
  return Math.max(40 / product.width_mm, Math.min(byW, byH));
}

function layout() {
  stageScale = computeStageScale();
  stage.style.width = `${product.width_mm * stageScale}px`;
  stage.style.height = `${product.height_mm * stageScale}px`;
  stage.style.backgroundColor = state.background;
  for (const layer of state.layers) {
    const el = layerEls.get(layer.id);
    if (el) positionLayerEl(layer, el);
  }
}

/* --- Layer DOM ----------------------------------------------------------- */

function positionLayerEl(layer: Layer, el: HTMLElement) {
  el.style.left = `${layer.x * stageScale}px`;
  el.style.top = `${layer.y * stageScale}px`;
  el.style.width = `${layer.w * stageScale}px`;
  if (layer.type === 'text') {
    styleTextEl(layer, el);
  } else {
    el.style.height = `${layer.h * stageScale}px`;
    const img = el.querySelector('img') as HTMLImageElement | null;
    if (img) {
      img.style.objectFit = layer.fit;
      img.style.borderRadius = `${layer.radius * stageScale}px`;
    }
    const ph = el.querySelector('.layer__placeholder') as HTMLElement | null;
    if (ph) ph.style.borderRadius = `${layer.radius * stageScale}px`;
  }
}

function styleTextEl(layer: TextLayer, el: HTMLElement) {
  const fpx = layer.size * stageScale;
  el.style.fontFamily = FONT_STACK[layer.font];
  el.style.fontSize = `${fpx}px`;
  el.style.fontWeight = String(layer.weight);
  el.style.fontStyle = layer.italic ? 'italic' : 'normal';
  el.style.color = layer.color;
  el.style.textAlign = layer.align;
  el.style.lineHeight = String(layer.lineHeight);
  el.style.letterSpacing = `${layer.tracking}em`;
}

function createLayerEl(layer: Layer): HTMLElement {
  const el = document.createElement('div');
  el.className = `layer layer--${layer.type}`;
  el.dataset.id = layer.id;

  if (layer.type === 'text') {
    const span = document.createElement('span');
    span.className = 'layer__text';
    span.textContent = layer.text;
    el.appendChild(span);
  } else {
    renderImageContent(layer, el);
  }

  const handle = document.createElement('div');
  handle.className = 'layer__handle';
  handle.setAttribute('aria-hidden', 'true');
  el.appendChild(handle);

  attachDragResize(layer, el, handle);
  el.addEventListener('pointerdown', () => select(layer.id), { capture: true });

  layerEls.set(layer.id, el);
  return el;
}

function renderImageContent(layer: ImageLayer, el: HTMLElement) {
  // clear any prior content but keep the handle
  el.querySelectorAll('img, .layer__placeholder').forEach((n) => n.remove());
  const handle = el.querySelector('.layer__handle');
  if (layer.src) {
    const img = document.createElement('img');
    img.src = layer.src;
    img.alt = '';
    img.draggable = false;
    el.insertBefore(img, handle);
  } else {
    const ph = document.createElement('div');
    ph.className = 'layer__placeholder';
    ph.textContent = 'Click, then upload a photo';
    el.insertBefore(ph, handle);
  }
}

function rebuildStage() {
  // remove all layer nodes (keep the guides overlay)
  layerEls.forEach((el) => el.remove());
  layerEls.clear();
  const guides = stage.querySelector('.stage__guides');
  for (const layer of state.layers) {
    const el = createLayerEl(layer);
    if (guides) stage.insertBefore(el, guides);
    else stage.appendChild(el);
  }
  layout();
  applySelectionStyles();
}

/* --- Selection ----------------------------------------------------------- */

function select(id: string | null) {
  state.selectedId = id;
  applySelectionStyles();
  buildInspector();
}

function applySelectionStyles() {
  layerEls.forEach((el, id) => el.classList.toggle('is-selected', id === state.selectedId));
}

function selectedLayer(): Layer | undefined {
  return state.layers.find((l) => l.id === state.selectedId);
}

/* --- Drag & resize (pointer events) -------------------------------------- */

function attachDragResize(layer: Layer, el: HTMLElement, handle: HTMLElement) {
  // Move
  el.addEventListener('pointerdown', (e) => {
    if ((e.target as HTMLElement).classList.contains('layer__handle')) return;
    e.preventDefault();
    select(layer.id);
    const startX = e.clientX;
    const startY = e.clientY;
    const ox = layer.x;
    const oy = layer.y;
    el.classList.add('is-dragging');
    el.setPointerCapture(e.pointerId);

    const move = (ev: PointerEvent) => {
      const dx = (ev.clientX - startX) / stageScale;
      const dy = (ev.clientY - startY) / stageScale;
      layer.x = clamp(ox + dx, -(layer.w - 8), product.width_mm - 8);
      const h = layer.type === 'image' ? layer.h : layer.size * layer.lineHeight;
      layer.y = clamp(oy + dy, -(h - 8), product.height_mm - 8);
      positionLayerEl(layer, el);
    };
    const up = (ev: PointerEvent) => {
      el.classList.remove('is-dragging');
      el.releasePointerCapture(ev.pointerId);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
  });

  // Resize
  handle.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    select(layer.id);
    const startX = e.clientX;
    const startY = e.clientY;
    const ow = layer.w;
    const oh = layer.type === 'image' ? layer.h : 0;
    handle.setPointerCapture(e.pointerId);

    const move = (ev: PointerEvent) => {
      const dw = (ev.clientX - startX) / stageScale;
      layer.w = clamp(ow + dw, 10, product.width_mm * 1.5);
      if (layer.type === 'image') {
        const dh = (ev.clientY - startY) / stageScale;
        layer.h = clamp(oh + dh, 10, product.height_mm * 1.5);
      }
      positionLayerEl(layer, el);
    };
    const up = (ev: PointerEvent) => {
      handle.releasePointerCapture(ev.pointerId);
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', up);
    };
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', up);
  });
}

/* --- Mutations ----------------------------------------------------------- */

function loadTemplate(templateId: string) {
  const tpl = product.templates.find((t) => t.id === templateId);
  if (!tpl) return;
  state.background = tpl.background;
  state.layers = clone(tpl.layers).map((l: Layer) => ({ ...l, id: uid(l.type) }));
  state.activeTemplate = templateId;
  state.selectedId = null;
  (document.getElementById('bg-color') as HTMLInputElement).value = tpl.background;
  rebuildStage();
  buildInspector();
  markActiveTemplate();
}

function addText() {
  const layer: TextLayer = {
    id: uid('t'),
    type: 'text',
    text: 'Your words here',
    x: product.width_mm * 0.15,
    y: product.height_mm * 0.4,
    w: product.width_mm * 0.7,
    font: 'display',
    size: Math.max(8, product.width_mm * 0.09),
    color: '#1f1a16',
    weight: 600,
    italic: false,
    align: 'center',
    lineHeight: 1.1,
    tracking: 0,
  };
  state.layers.push(layer);
  state.activeTemplate = null;
  markActiveTemplate();
  rebuildStage();
  select(layer.id);
}

function addImage() {
  const side = Math.min(product.width_mm, product.height_mm) * 0.5;
  const layer: ImageLayer = {
    id: uid('i'),
    type: 'image',
    src: null,
    x: (product.width_mm - side) / 2,
    y: (product.height_mm - side) / 2,
    w: side,
    h: side,
    fit: 'cover',
    radius: 2,
  };
  state.layers.push(layer);
  state.activeTemplate = null;
  markActiveTemplate();
  rebuildStage();
  select(layer.id);
  openImagePicker();
}

function deleteSelected() {
  if (!state.selectedId) return;
  state.layers = state.layers.filter((l) => l.id !== state.selectedId);
  select(null);
  rebuildStage();
}

function reorderSelected(dir: 1 | -1) {
  const i = state.layers.findIndex((l) => l.id === state.selectedId);
  if (i < 0) return;
  const j = i + dir;
  if (j < 0 || j >= state.layers.length) return;
  [state.layers[i], state.layers[j]] = [state.layers[j], state.layers[i]];
  rebuildStage();
  applySelectionStyles();
}

/* --- Image upload -------------------------------------------------------- */

let pendingImageLayer: string | null = null;
const imageInput = document.getElementById('image-input') as HTMLInputElement;

function openImagePicker() {
  pendingImageLayer = state.selectedId;
  imageInput.value = '';
  imageInput.click();
}

imageInput.addEventListener('change', () => {
  const file = imageInput.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const layer = state.layers.find((l) => l.id === pendingImageLayer);
    if (layer && layer.type === 'image') {
      layer.src = String(reader.result);
      const el = layerEls.get(layer.id);
      if (el) {
        renderImageContent(layer, el);
        positionLayerEl(layer, el);
      }
      buildInspector();
    }
  };
  reader.readAsDataURL(file);
});

/* --- Inspector (built per selection) ------------------------------------- */

const inspector = document.getElementById('inspector')!;

function field(label: string, control: HTMLElement): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'field';
  const l = document.createElement('label');
  l.textContent = label;
  wrap.append(l, control);
  return wrap;
}

function segmented(
  options: { value: string; label: string }[],
  current: string,
  onPick: (v: string) => void
): HTMLElement {
  const seg = document.createElement('div');
  seg.className = 'seg';
  for (const o of options) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = o.label;
    b.setAttribute('aria-pressed', String(o.value === current));
    b.addEventListener('click', () => {
      onPick(o.value);
      seg.querySelectorAll('button').forEach((x) =>
        x.setAttribute('aria-pressed', String(x === b))
      );
    });
    seg.appendChild(b);
  }
  return seg;
}

function refreshSelected() {
  const layer = selectedLayer();
  const el = layer && layerEls.get(layer.id);
  if (layer && el) positionLayerEl(layer, el);
}

function buildInspector() {
  inspector.innerHTML = '';
  const layer = selectedLayer();
  if (!layer) {
    const p = document.createElement('p');
    p.className = 'muted';
    p.textContent = 'Nothing selected. Click an element on the canvas, or add one above.';
    inspector.appendChild(p);
    return;
  }

  if (layer.type === 'text') {
    const ta = document.createElement('textarea');
    ta.value = layer.text;
    ta.addEventListener('input', () => {
      layer.text = ta.value;
      const span = layerEls.get(layer.id)?.querySelector('.layer__text');
      if (span) span.textContent = layer.text;
    });
    inspector.appendChild(field('Text', ta));

    const fontSel = document.createElement('select');
    for (const [key, name] of [['display', 'Serif (Fraunces)'], ['body', 'Sans (Inter)'], ['mono', 'Mono']] as const) {
      const o = document.createElement('option');
      o.value = key;
      o.textContent = name;
      o.selected = layer.font === key;
      fontSel.appendChild(o);
    }
    fontSel.addEventListener('change', () => {
      layer.font = fontSel.value as FontKey;
      refreshSelected();
    });
    inspector.appendChild(field('Font', fontSel));

    const size = rangeInput(6, Math.round(product.width_mm * 0.4), 0.5, layer.size, (v) => {
      layer.size = v;
      refreshSelected();
    });
    const weight = document.createElement('select');
    for (const w of [300, 400, 500, 600, 700, 900]) {
      const o = document.createElement('option');
      o.value = String(w);
      o.textContent = String(w);
      o.selected = layer.weight === w;
      weight.appendChild(o);
    }
    weight.addEventListener('change', () => {
      layer.weight = Number(weight.value);
      refreshSelected();
    });
    inspector.appendChild(row2(field('Size (mm)', size), field('Weight', weight)));

    const color = document.createElement('input');
    color.type = 'color';
    color.value = normalizeHex(layer.color);
    color.addEventListener('input', () => {
      layer.color = color.value;
      refreshSelected();
    });
    const align = segmented(
      [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
      ],
      layer.align,
      (v) => {
        layer.align = v as Align;
        refreshSelected();
      }
    );
    inspector.appendChild(row2(field('Colour', color), field('Align', align)));

    const tracking = rangeInput(-0.05, 0.4, 0.01, layer.tracking, (v) => {
      layer.tracking = v;
      refreshSelected();
    });
    const line = rangeInput(0.85, 2, 0.05, layer.lineHeight, (v) => {
      layer.lineHeight = v;
      refreshSelected();
    });
    inspector.appendChild(row2(field('Letter-spacing', tracking), field('Line-height', line)));

    const italic = segmented(
      [
        { value: 'off', label: 'Regular' },
        { value: 'on', label: 'Italic' },
      ],
      layer.italic ? 'on' : 'off',
      (v) => {
        layer.italic = v === 'on';
        refreshSelected();
      }
    );
    inspector.appendChild(field('Style', italic));
  } else {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'button button--ghost';
    btn.style.width = '100%';
    btn.textContent = layer.src ? 'Replace photo' : 'Upload photo';
    btn.addEventListener('click', () => {
      state.selectedId = layer.id;
      openImagePicker();
    });
    inspector.appendChild(field('Photo', btn));

    const fit = segmented(
      [
        { value: 'cover', label: 'Fill' },
        { value: 'contain', label: 'Fit' },
      ],
      layer.fit,
      (v) => {
        layer.fit = v as 'cover' | 'contain';
        refreshSelected();
      }
    );
    const radius = rangeInput(0, Math.min(product.width_mm, product.height_mm) / 2, 0.5, layer.radius, (v) => {
      layer.radius = v;
      refreshSelected();
    });
    inspector.appendChild(row2(field('Photo fit', fit), field('Corner (mm)', radius)));
  }

  // Common layer actions
  const actions = document.createElement('div');
  actions.className = 'layer-actions';
  actions.append(
    actionBtn('Back', () => reorderSelected(-1)),
    actionBtn('Forward', () => reorderSelected(1)),
    actionBtn('Delete', deleteSelected, true)
  );
  inspector.appendChild(actions);
}

function rangeInput(min: number, max: number, step: number, value: number, onInput: (v: number) => void): HTMLElement {
  const wrap = document.createElement('div');
  const input = document.createElement('input');
  input.type = 'range';
  input.min = String(min);
  input.max = String(max);
  input.step = String(step);
  input.value = String(value);
  const out = document.createElement('span');
  out.className = 'muted';
  out.style.fontSize = 'var(--text-xs)';
  out.textContent = String(round2(value));
  input.addEventListener('input', () => {
    const v = Number(input.value);
    out.textContent = String(round2(v));
    onInput(v);
  });
  wrap.append(input, out);
  return wrap;
}

function row2(a: HTMLElement, b: HTMLElement): HTMLElement {
  const r = document.createElement('div');
  r.className = 'row2';
  r.append(a, b);
  return r;
}

function actionBtn(label: string, onClick: () => void, danger = false): HTMLElement {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = label;
  if (danger) b.className = 'danger';
  b.addEventListener('click', onClick);
  return b;
}

/* --- Panel wiring -------------------------------------------------------- */

function buildTemplateList() {
  const list = document.getElementById('tpl-list')!;
  list.innerHTML = '';
  for (const tpl of product.templates) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'tpl__btn';
    b.dataset.tpl = tpl.id;
    const sw = document.createElement('span');
    sw.className = 'tpl__swatch';
    sw.style.background = tpl.background;
    const name = document.createElement('span');
    name.textContent = tpl.name;
    b.append(sw, name);
    b.addEventListener('click', () => loadTemplate(tpl.id));
    list.appendChild(b);
  }
}

function markActiveTemplate() {
  document.querySelectorAll<HTMLElement>('.tpl__btn').forEach((b) =>
    b.setAttribute('aria-pressed', String(b.dataset.tpl === state.activeTemplate))
  );
}

function buildSwatches() {
  const wrap = document.getElementById('bg-swatches')!;
  for (const c of PALETTE) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'swatch';
    b.style.background = c;
    b.title = c;
    b.addEventListener('click', () => setBackground(c));
    wrap.appendChild(b);
  }
}

function setBackground(hex: string) {
  state.background = hex;
  stage.style.backgroundColor = hex;
  (document.getElementById('bg-color') as HTMLInputElement).value = normalizeHex(hex);
}

document.getElementById('bg-color')!.addEventListener('input', (e) => {
  setBackground((e.target as HTMLInputElement).value);
});
document.getElementById('add-text')!.addEventListener('click', addText);
document.getElementById('add-image')!.addEventListener('click', addImage);
document.getElementById('export-png')!.addEventListener('click', exportPng);
document.getElementById('export-json')!.addEventListener('click', exportJson);

// Click empty canvas → deselect
canvasArea.addEventListener('pointerdown', (e) => {
  if (e.target === canvasArea || e.target === stageWrap) select(null);
});
stage.addEventListener('pointerdown', (e) => {
  if (e.target === stage || (e.target as HTMLElement).classList.contains('stage__guides')) select(null);
});

// Keyboard: delete / nudge
window.addEventListener('keydown', (e) => {
  if (!state.selectedId) return;
  const tag = (document.activeElement?.tagName || '').toLowerCase();
  if (tag === 'textarea' || tag === 'input' || tag === 'select') return;
  const layer = selectedLayer();
  if (!layer) return;
  if (e.key === 'Delete' || e.key === 'Backspace') {
    e.preventDefault();
    deleteSelected();
  } else if (e.key.startsWith('Arrow')) {
    e.preventDefault();
    const step = e.shiftKey ? 5 : 1;
    if (e.key === 'ArrowLeft') layer.x -= step;
    if (e.key === 'ArrowRight') layer.x += step;
    if (e.key === 'ArrowUp') layer.y -= step;
    if (e.key === 'ArrowDown') layer.y += step;
    refreshSelected();
  }
});

window.addEventListener('resize', layout);

/* --- Export: print-ready raster proof ------------------------------------ */

const status = document.getElementById('proof-status');
function setStatus(msg: string) {
  if (status) status.textContent = msg;
}

async function ensureFonts() {
  if (!('fonts' in document)) return;
  const specs = [
    'italic 600 40px "Fraunces Variable"',
    '900 40px "Fraunces Variable"',
    '600 40px "Fraunces Variable"',
    '400 40px "Fraunces Variable"',
    '600 40px "Inter Variable"',
    '400 40px "Inter Variable"',
  ];
  try {
    await Promise.all(specs.map((s) => (document as any).fonts.load(s)));
    await (document as any).fonts.ready;
  } catch {
    /* non-fatal: fall back to system metrics */
  }
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const out: string[] = [];
  for (const para of text.split('\n')) {
    if (para === '') {
      out.push('');
      continue;
    }
    const words = para.split(/\s+/);
    let line = '';
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        out.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) out.push(line);
  }
  return out;
}

function drawText(ctx: CanvasRenderingContext2D, layer: TextLayer, s: number) {
  const fpx = layer.size * s;
  ctx.font = `${layer.italic ? 'italic ' : ''}${layer.weight} ${fpx}px ${FONT_STACK[layer.font]}`;
  ctx.fillStyle = layer.color;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  try {
    (ctx as any).letterSpacing = `${layer.tracking * fpx}px`;
  } catch {
    /* older engines ignore letterSpacing */
  }
  const maxW = layer.w * s;
  const lines = wrapText(ctx, layer.text, maxW);
  const lh = layer.size * layer.lineHeight * s;
  const left = layer.x * s;
  let y = layer.y * s + fpx * 0.82; // approx ascent → baseline of first line
  for (const line of lines) {
    const w = ctx.measureText(line).width;
    let x = left;
    if (layer.align === 'center') x = left + (maxW - w) / 2;
    else if (layer.align === 'right') x = left + (maxW - w);
    ctx.fillText(line, x, y);
    y += lh;
  }
  try {
    (ctx as any).letterSpacing = '0px';
  } catch {
    /* ignore */
  }
}

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  if (typeof (ctx as any).roundRect === 'function') {
    (ctx as any).roundRect(x, y, w, h, rr);
    return;
  }
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function drawImage(ctx: CanvasRenderingContext2D, layer: ImageLayer, s: number) {
  const bx = layer.x * s;
  const by = layer.y * s;
  const bw = layer.w * s;
  const bh = layer.h * s;
  const r = layer.radius * s;

  if (!layer.src) {
    ctx.save();
    ctx.fillStyle = '#efe9df';
    ctx.beginPath();
    roundRectPath(ctx, bx, by, bw, bh, r);
    ctx.fill();
    ctx.restore();
    return;
  }

  const img = await loadImage(layer.src);
  const scale =
    layer.fit === 'cover'
      ? Math.max(bw / img.width, bh / img.height)
      : Math.min(bw / img.width, bh / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  const dx = bx + (bw - dw) / 2;
  const dy = by + (bh - dh) / 2;

  ctx.save();
  ctx.beginPath();
  roundRectPath(ctx, bx, by, bw, bh, r);
  ctx.clip();
  if (layer.fit === 'contain') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bx, by, bw, bh);
  }
  ctx.drawImage(img, dx, dy, dw, dh);
  ctx.restore();
}

async function renderToCanvas(): Promise<HTMLCanvasElement> {
  const s = product.dpi / 25.4; // px per mm at print resolution
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(product.width_mm * s);
  canvas.height = Math.round(product.height_mm * s);
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = state.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (const layer of state.layers) {
    if (layer.type === 'image') await drawImage(ctx, layer, s);
    else drawText(ctx, layer, s);
  }
  return canvas;
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function exportPng() {
  const prev = selectedLayer()?.id ?? null;
  select(null); // hide selection chrome (it's DOM only, but be safe)
  setStatus('Preparing your print-ready proof…');
  try {
    await ensureFonts();
    const canvas = await renderToCanvas();
    await new Promise<void>((resolve) =>
      canvas.toBlob((blob) => {
        if (blob) download(blob, `meish-${product.slug}-proof.png`);
        resolve();
      }, 'image/png')
    );
    setStatus(`Proof downloaded — ${canvas.width}×${canvas.height}px at ${product.dpi} dpi. Reply to your reservation with it and we’ll print.`);
  } catch (err) {
    console.error(err);
    setStatus('Something went wrong exporting the proof. Please try again.');
  }
  if (prev) select(prev);
}

/* --- Export: the print-ready design artifact (spec) ---------------------- */

function exportJson() {
  const artifact = {
    schema: 'meish.design/v1',
    product: {
      slug: product.slug,
      name: product.name,
      category: product.category,
      width_mm: product.width_mm,
      height_mm: product.height_mm,
      dpi: product.dpi,
      bleed_mm: product.bleed_mm,
    },
    background: state.background,
    layers: state.layers,
  };
  const blob = new Blob([JSON.stringify(artifact, null, 2)], { type: 'application/json' });
  download(blob, `meish-${product.slug}-design.json`);
  setStatus('Design file saved. Keep it to reorder or tweak later — it holds every element and setting.');
}

/* --- Helpers ------------------------------------------------------------- */

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
function normalizeHex(c: string): string {
  return /^#[0-9a-fA-F]{6}$/.test(c) ? c : '#000000';
}

/* --- Go ------------------------------------------------------------------ */

buildTemplateList();
buildSwatches();
if (product.templates[0]) {
  loadTemplate(product.templates[0].id);
} else {
  rebuildStage();
}
buildInspector();
