/** Public navigation and shared contact CTAs for meish.work */
import { CONTACT_EMAIL, meishMailto } from '../lib/meish-mailto';

export const hatchlingNav = [
  { href: '/for-business', label: 'For Your Business' },
  { href: '/for-you', label: 'For You' },
  { href: '/tools', label: 'Tools' },
  { href: '/gifts', label: 'Gifts for You' },
] as const;

/** Alias — same public nav. */
export const publicNav = hatchlingNav;

export const contactEmail = CONTACT_EMAIL;

export const contactMeishLabel = 'Should we Meish this?';
export const contactMeishHref = meishMailto({
  product: 'Should we Meish this',
  page: 'Site',
  section: 'Header',
  cta: 'Should we Meish this',
});

/** Secondary free conversation — Meish & you / Meish & your business. Not a health check. */
export const fitCallLabel = '20-minute Fit Check';
export const fitCallMeta = '20 min · free · Meish & you';
export const fitCallHref = meishMailto({
  product: '20-minute Fit Check',
  page: 'Site',
  section: 'Fit Check',
  cta: 'Fit Check',
});

/** Same destination as fitCallHref (legacy import name). */
export const fitCheckHref = fitCallHref;
