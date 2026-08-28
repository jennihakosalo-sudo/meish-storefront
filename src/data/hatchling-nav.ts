/** Hatchling v1 — minimal public navigation.
 *  Public CTA: Should We Meish This? / Fit Call · 20 min · free. */
export const hatchlingNav = [
  { href: '/for-business', label: 'For Your Business' },
  { href: '/for-you', label: 'For You' },
  { href: '/tools', label: 'Tools' },
  { href: '/gifts', label: 'Gifts for You' },
] as const;

export const fitCallHref =
  'mailto:jenni@meish.work?subject=Should%20We%20Meish%20This%3F';

/** Same destination as fitCallHref. Kept so existing imports keep working. */
export const fitCheckHref = fitCallHref;

export const fitCallLabel = 'Should We Meish This?';
export const fitCallMeta = '20 min · free';

export const contactEmail = 'jenni@meish.work';
