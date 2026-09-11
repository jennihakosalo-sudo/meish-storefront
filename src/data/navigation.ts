/**
 * Public navigation and shared calls to action for meish.work.
 *
 * Replaces the former `hatchling-nav`. "Hatchling" was an internal name for a
 * launch phase; it should never have been visible in a customer-facing module,
 * and there is deliberately no replacement nickname.
 *
 * The header carries destinations a visitor might actually be looking for.
 * Internal Meish classifications — pathways, layers, phases — stay internal.
 */
import { CONTACT_EMAIL, meishMailto } from '../lib/meish-mailto';

export interface NavLink {
  href: string;
  label: string;
}

/**
 * @deprecated The header and footer now read `nav` from `site-content`, which
 * is also where copy is edited. This list is kept only for pages not yet moved
 * over. /for-you and /treasure are deliberately absent: their source files
 * still exist but nothing public links to them in this release.
 */
export const primaryNav: NavLink[] = [
  { href: '/for-business', label: 'Business' },
  { href: '/for-your-space', label: 'Space' },
  { href: '/tools', label: 'Tools' },
  { href: '/about', label: 'About' },
];

/** Reachable, but not competing with the primary six. */
export const secondaryNav: NavLink[] = [{ href: 'mailto:moona.m@meish.work?subject=Meish', label: 'Email Meish' }];

export const allPublicNav: NavLink[] = [...primaryNav, ...secondaryNav];

export const contactEmail = CONTACT_EMAIL;

/* --- Calls to action ------------------------------------------------------
   The old primary CTA was "What should become better?", which assumes
   something is wrong before the visitor has said anything. Meish does not
   start from a fault. The replacement states what clicking does.
   ------------------------------------------------------------------------ */

export const exploreLabel = 'Explore what Meish can do';
export const exploreHref = '/#products';

/**
 * The one action on the public site. The named, priced 20-minute Fit Check and
 * its route were retired: see `contactAction` in site-content, which is what
 * the header, footer and every page ending now use.
 */
export const writeDirectHref = meishMailto({
  product: 'Meish',
  page: 'Site',
  section: 'Contact',
  cta: 'Email Meish',
});

/* --- Transitional aliases -------------------------------------------------
   Pages not yet rebuilt still ask for the old names. They resolve to the new
   canonical CTAs so nothing renders retired language while the rest of the
   site is brought over. Delete each one as its page is rebuilt.
   ------------------------------------------------------------------------ */

/** @deprecated Use exploreLabel. */
export const becomeBetterLabel = exploreLabel;
/** @deprecated Use exploreHref. */
export const becomeBetterHref = exploreHref;
/** @deprecated Use exploreLabel. */
export const contactMeishLabel = exploreLabel;
/** @deprecated Use exploreHref. */
export const contactMeishHref = exploreHref;

/** @deprecated The Fit Check is retired. Use writeDirectHref. */
export const fitCheckLabel = 'Email Meish';
/** @deprecated The Fit Check is retired. Use writeDirectHref. */
export const fitCheckHref = writeDirectHref;
/** @deprecated The Fit Check is retired. Use writeDirectHref. */
export const fitYouLabel = fitCheckLabel;
/** @deprecated The Fit Check is retired. Use writeDirectHref. */
export const fitYouHref = fitCheckHref;
/** @deprecated The Fit Check is retired. Use writeDirectHref. */
export const fitBusinessLabel = fitCheckLabel;
/** @deprecated The Fit Check is retired. Use writeDirectHref. */
export const fitBusinessHref = fitCheckHref;

/** @deprecated The header no longer exposes internal pathway names. */
export const pathwayNav = primaryNav;
