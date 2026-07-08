# Managing products (no code required)

Meish Printed's catalogue is **content, not code**. Every product is one small
file under `src/data/catalog/`. Add a file → the product appears on the site
after the next build. Edit a file → the product changes. Delete a file → it's
gone. There is nothing else to touch.

You have two ways to do this: a **visual admin** (recommended) or **editing the
JSON directly**.

---

## Option A — the visual admin (Decap CMS, recommended)

A form-based editor lives at **`/admin`**. You fill in fields ("Name", "Price",
"Description", upload a photo…) and press *Publish*. It writes the product file
for you.

### Run it locally today (no accounts, no hosting)

```bash
npm install        # once
npm run cms        # starts the admin's local helper (leave it running)
npm run dev        # starts the site (leave it running)
```

Then open <http://localhost:4321/admin/>. Add or edit a product, press
*Publish* — the JSON file in `src/data/catalog/` is written straight away. Stop
and re-run `npm run build` (or `npm run dev` auto-reloads) and the product is
live in the preview.

### Run it hosted (so the CEO can edit from any browser)

This needs the site's production host + a login to be wired up first. It is a
tracked follow-up of MEI-18 and rides the hosting decision in **MEI-23**. Once
the repo has a git remote and a host is chosen, point the `backend:` block in
`public/admin/config.yml` at the git provider (git-gateway + Netlify Identity,
or the GitHub backend) and the same `/admin` page works from the open web.

---

## Option B — add a file by hand

Copy an existing file in `src/data/catalog/`, rename it, and edit the values.
**The file name becomes the web address:** `verse-quote-print.json` →
`/shop/verse-quote-print`. Use lowercase letters, numbers and dashes.

```jsonc
{
  "name": "Verse",                       // shown as the product title
  "category": "quotes",                  // one of: quotes | wall-decor | tin-plates | restaurant
  "tagline": "A line worth living with.",
  "description": "A sentence or two shown on the product page.",
  "priceLabel": "from €24",              // the human price shown to shoppers
  "price": {                             // the exact amount charged at checkout
    "unitAmountCents": 2400,             // whole euro CENTS — 2400 = €24.00
    "minQuantity": 1,                    // restaurant runs use e.g. 250
    "unitLabel": "per print"
  },
  "material": "Giclée on 240gsm cotton paper",
  "orientationNote": "Portrait · A3",    // short size caption on the card
  "width_mm": 297,                       // print size — drives the design studio
  "height_mm": 420,
  "dpi": 300,                            // 300 for prints, 150 for big single-use runs
  "bleed_mm": 3,
  "tone": "#c98a5e",                     // warm placeholder tint until a real photo
  "image": "/images/products/verse.jpg", // OPTIONAL real photo; omit to use the tint
  "order": 10                            // lower shows first within its category
}
```

Then run `npm run build`. If a value is wrong (e.g. a bad category), the build
stops with a plain-language message naming the file and field to fix.

---

## What's code, and why

The **design-studio templates** — the starting layouts a customer edits in the
browser — live in `src/data/templates.ts`, keyed by the product's file name.
They're precise layout geometry (positions, sizes in millimetres), so they stay
in code rather than the CMS. A brand-new product with no template still works:
it gets one clean blank layout automatically, and the customer builds from
there. If you want a bespoke starting layout for a product, ask an engineer to
add one to `templates.ts`.

Everything a shop owner actually edits — name, price, description, category,
photo, size — is content, editable without an engineer.
