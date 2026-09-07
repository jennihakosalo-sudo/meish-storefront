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
export const secondaryNav: NavLink[] = [{ href: '/contact', label: 'Contact' }];

export const allPublicNav: NavLink[] = [...primaryNav, ...secondaryNav];

export const contactEmail = CONTACT_EMAIL;

/* --- Calls to action ------------------------------------------------------
   The old primary CTA was "What should become better?", which assumes
   something is wrong before the visitor has said anything. Meish does not
   start from a fault. The replacement states what clicking does.
   ------------------------------------------------------------------------ */

export const exploreLabel = 'Explore what Meish can do';
export const exploreHref = '/#what-we-can-do-together';

/** The free entry conversation. Always priced in the label — it is the point. */
export const fitCheckLabel = '20-minute Fit Check — €0';
export const fitCheckHref = '/fit-check';

/** Used where a direct message genuinely is the better route. */
export const writeDirectHref = meishMailto({
  product: '20-minute Fit Check',
  page: 'Site',
  section: 'Fit Check',
  cta: 'Book a Fit Check',
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

/** @deprecated One Fit Check now, not two. Use fitCheckLabel. */
export const fitYouLabel = fitCheckLabel;
/** @deprecated Use fitCheckHref. */
export const fitYouHref = fitCheckHref;
/** @deprecated One Fit Check now, not two. Use fitCheckLabel. */
export const fitBusinessLabel = fitCheckLabel;
/** @deprecated Use fitCheckHref. */
export const fitBusinessHref = fitCheckHref;

/** @deprecated The header no longer exposes internal pathway names. */
export const pathwayNav = primaryNav;
