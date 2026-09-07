/** Public contact + mailto links for meish.work */

export const CONTACT_EMAIL = 'moona.m@meish.work';
export const SITE_ORIGIN = 'https://www.meish.work';

export type MeishMailtoOpts = {
  product: string;
  page?: string;
  section?: string;
  cta?: string;
  pageUrl?: string;
  extraBody?: string;
};

/**
 * A mailto whose subject is just the product name.
 *
 * This used to build a subject of the form
 * `MEISH | Product | Page | CTA clicked` and pre-fill the body with a source
 * trace and a seven-item checklist. Two problems with that: the visitor saw a
 * form they had not asked to fill in and had to delete before writing, and the
 * subject line was unreadable in an inbox. Source tracking was for us, at the
 * customer's expense, so it is gone.
 *
 * `page`, `section` and `cta` are accepted and ignored so existing call sites
 * keep working; remove them as each page is next touched.
 */
export function meishMailto(opts: MeishMailtoOpts): string {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(opts.product)}`;
}
