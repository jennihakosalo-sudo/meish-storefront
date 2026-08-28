/** Hatchling v1 — public navigation and the shared Fit Check CTA. */
export const hatchlingNav = [
  { href: '/for-business', label: 'For Your Business' },
  { href: '/for-you', label: 'For You' },
  { href: '/tools', label: 'Tools' },
  { href: '/gifts', label: 'Gifts for You' },
] as const;

export const fitCallHref =
  'mailto:jenni@meish.work?subject=20-minute%20Fit%20Check';

/** Same destination as fitCallHref. Kept so existing imports keep working. */
export const fitCheckHref = fitCallHref;

export const fitCallLabel = '20-minute Fit Check';
export const fitCallMeta =
  'how can we make things better for you or your business?';

export const contactEmail = 'jenni@meish.work';
