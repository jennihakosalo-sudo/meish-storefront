/** Public navigation and shared contact CTAs for meish.work */
import { CONTACT_EMAIL, meishMailto } from '../lib/meish-mailto';

/** Header pathways — approved first-release logic. */
export const pathwayNav = [
  { href: '/#review', label: 'Review' },
  { href: '/#improve', label: 'Improve' },
  { href: '/#build', label: 'Build' },
  { href: '/tools', label: 'Tools' },
  { href: '/#offers', label: 'Offers' },
] as const;

/** Audience doors — footer and in-page routes, not header pathways. */
export const hatchlingNav = [
  { href: '/for-business', label: 'Meish & Your Business' },
  { href: '/for-you', label: 'Meish & You' },
  { href: '/tools', label: 'Tools' },
  { href: '/gifts', label: 'Gifts for You' },
] as const;

/** Alias — audience doors. */
export const publicNav = hatchlingNav;

export const contactEmail = CONTACT_EMAIL;

export const becomeBetterLabel = 'What should become better?';
export const becomeBetterHref = meishMailto({
  product: 'What should become better',
  page: 'Site',
  section: 'Header',
  cta: 'What should become better',
});

export const contactMeishLabel = becomeBetterLabel;
export const contactMeishHref = becomeBetterHref;

export const fitYouLabel = '20-minute Meish & You Fit Check';
export const fitYouHref = meishMailto({
  product: '20-minute Meish & You Fit Check',
  page: 'Site',
  section: 'Meish & You Fit Check',
  cta: 'Meish & You Fit Check',
});

export const fitBusinessLabel = '20-minute Meish & Your Business Fit Check';
export const fitBusinessHref = meishMailto({
  product: '20-minute Meish & Your Business Fit Check',
  page: 'Site',
  section: 'Meish & Your Business Fit Check',
  cta: 'Meish & Your Business Fit Check',
});

/** @deprecated Do not show this string. Use fitYouLabel or fitBusinessLabel. */
export const fitCallLabel = fitBusinessLabel;
export const fitCallMeta = '20 min · free · Meish & Your Business';
export const fitCallHref = fitBusinessHref;
export const fitCheckHref = fitBusinessHref;
