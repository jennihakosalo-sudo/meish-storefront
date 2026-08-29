/** Public contact + tracked mailto links for meish.work */

export const CONTACT_EMAIL = 'moona.m@meish.work';
export const SITE_ORIGIN = 'https://www.meish.work';

export type MeishMailtoOpts = {
  product: string;
  page: string;
  section: string;
  cta: string;
  pageUrl?: string;
  extraBody?: string;
};

/**
 * Subject: MEISH | [PRODUCT] | [PAGE] | [CTA]
 * Body includes source tracking fields for Moona.
 */
export function meishMailto(opts: MeishMailtoOpts): string {
  const subject = `MEISH | ${opts.product} | ${opts.page} | ${opts.cta}`;
  const body = [
    'MEISH WEBSITE INQUIRY',
    '',
    `Product / topic: ${opts.product}`,
    `Source page: ${opts.page}`,
    `Section: ${opts.section}`,
    `CTA clicked: ${opts.cta}`,
    `Page URL: ${opts.pageUrl ?? SITE_ORIGIN}`,
    '',
    opts.extraBody ??
      [
        'What I would like to make better (mark Y where useful):',
        '',
        '[ ] Fewer tasks I dislike',
        '[ ] More time with my family',
        '[ ] More peace in my workday',
        '[ ] Help using AI',
        '[ ] Better customer experience',
        '[ ] How my business works',
        '[ ] Something else:',
        '',
        'A few words about the situation:',
        '',
      ].join('\n'),
  ].join('\n');

  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
