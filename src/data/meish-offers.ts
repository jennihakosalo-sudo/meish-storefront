/**
 * Approved PUBLIC Meish B2B offers — single source of truth for homepage & Business.
 * Shop print catalogue lives in src/data/products.ts (MEI-18).
 * Canonical prices: MEISH-AI-OFFERS.md · Hatchling commercial ladder.
 */

export type OfferCategory =
  | 'START HERE'
  | "SEE WHAT'S POSSIBLE"
  | 'BUILD SOMETHING USEFUL'
  | 'REMOVE FRICTION'
  | 'LOOK AT THE WHOLE EXPERIENCE'
  | 'BRING MEISH IN';

export type OrbitId = 'review' | 'improve' | 'build' | 'tools';

export interface MeishOffer {
  id: string;
  name: string;
  summary: string;
  whoFor: string;
  price: string;
  priceNote?: string;
  duration?: string;
  category: OfferCategory;
  orbit: OrbitId;
  priority: number;
  cta: string;
  ctaHref: string;
  includes: string[];
  /** When true, priceNote should render “Gamma Test Phase” as a clickable control. */
  gammaTestPhase?: boolean;
  lenses?: string[];
  applications?: string[];
}

export interface OrbitGroup {
  id: OrbitId;
  shortLabel: string;
  tagline: string;
  placard: string;
  href: string;
  angle: number;
  tint: 'lavender' | 'gold' | 'navy' | 'red';
}

export const meishOffers: MeishOffer[] = [
  {
    id: 'fit-check',
    name: 'Meish AI Fit Check',
    summary:
      '20 minutes. No preparation required. We find out whether there is something useful to do — and what should happen first.',
    whoFor: 'B2B entrepreneur / decision-maker',
    price: '0 €',
    duration: '20 min',
    category: 'START HERE',
    orbit: 'review',
    priority: 1,
    cta: 'Book a Fit Check',
    ctaHref: 'mailto:jenni@meish.work?subject=Meish%20AI%20Fit%20Check',
    includes: [
      'A quick conversation about your situation and goals',
      'Whether there is a useful Meish / AI opportunity worth pursuing',
      'A clear recommendation for the right first step',
    ],
  },
  {
    id: 'possibility-map',
    name: 'Meish Possibility Map',
    summary: 'See where AI can actually create value in your business — and leave with a concrete next path.',
    whoFor: 'B2B entrepreneur / decision-maker',
    price: '590 € + VAT',
    priceNote: '· Gamma Test Phase\nRegular price 950 € + VAT',
    duration: 'Delivered within five business days of the interview',
    category: "SEE WHAT'S POSSIBLE",
    orbit: 'review',
    priority: 2,
    cta: "See what's possible",
    ctaHref: 'mailto:jenni@meish.work?subject=Meish%20Possibility%20Map',
    gammaTestPhase: true,
    includes: [
      '60-minute client interview',
      'Three concrete routes / possibilities',
      'One clear recommendation for the first implementation',
      'Practical actions for the next 30 days',
      'Five practical guardrails — things to protect or avoid',
      'Visible Possibility Map and written summary',
      'AI tools review — competitive edge, time saved, new business angles',
      '30-minute results walkthrough',
    ],
  },
  {
    id: 'build-with-meish',
    name: 'Build with Meish',
    summary: 'Turn one useful opportunity into something concrete — after you know what is worth building.',
    whoFor: 'B2B entrepreneur / decision-maker with a clear opportunity ready to act on',
    price: '790 € + VAT',
    duration: '3–4 hours',
    category: 'BUILD SOMETHING USEFUL',
    orbit: 'build',
    priority: 3,
    cta: 'Build something useful',
    ctaHref: 'mailto:jenni@meish.work?subject=Build%20with%20Meish',
    includes: [
      'Joint working session with a clear goal',
      'One selected AI / Meish solution designed and scoped',
      'Ready for its next implementation step',
      'Documentation so you can continue independently',
    ],
  },
  {
    id: 'friction-removal',
    name: 'Meish Friction Removal',
    summary: 'Find and remove unnecessary work — repeated tasks, unclear processes and avoidable friction.',
    whoFor: 'Businesses where friction is consuming meaningful time',
    price: 'From 1,899 € + VAT',
    category: 'REMOVE FRICTION',
    orbit: 'improve',
    priority: 4,
    cta: 'Remove friction',
    ctaHref: 'mailto:jenni@meish.work?subject=Meish%20Friction%20Removal',
    includes: [
      'Friction map / assessment across your operations',
      '3–7 concrete interventions or tools',
      'Prioritized implementation',
      'Focus on meaningful saved working time',
      'Target: recover at least five work hours per week',
    ],
  },
  {
    id: 'human-experience-review',
    name: 'Human Experience Review',
    summary: 'Understand how the experience actually feels — and what would make it better.',
    whoFor: 'Hotels, venues, services, journeys, spaces and transitions where human experience matters',
    price: 'Scope & price after a free Fit Check',
    category: 'LOOK AT THE WHOLE EXPERIENCE',
    orbit: 'review',
    priority: 5,
    cta: 'Review the experience',
    ctaHref: 'mailto:jenni@meish.work?subject=Human%20Experience%20Review',
    includes: [
      'Lived-experience review of your customer or team journey',
      'Friction made visible with realistic alternatives',
      'Prioritised improvements aligned with human agency',
    ],
    applications: [
      'Hotel',
      'Venue',
      'Service',
      'Customer journey',
      'Physical environment',
      'Transition',
      'Customer experience',
    ],
  },
  {
    id: 'week-with-meish',
    name: 'A Week with Meish',
    summary: 'Bring Meish into the real work for a week — not only a diagnosis or one small tool.',
    whoFor: 'Teams that need Meish inside the actual work for a focused week',
    price: 'From 7,500 € + VAT',
    duration: '1 week',
    category: 'BRING MEISH IN',
    orbit: 'build',
    priority: 6,
    cta: 'Work with Meish',
    ctaHref: 'mailto:jenni@meish.work?subject=A%20Week%20with%20Meish',
    includes: [
      'One week of practical co-working inside your business',
      'Built solutions and operating models for your actual work',
      'Written continuation guidance',
      'Two 45-minute follow-up conversations, timed when they matter',
    ],
  },
];

export const orbitGroups: OrbitGroup[] = [
  {
    id: 'review',
    shortLabel: 'Review',
    tagline: 'Understand what is actually happening',
    placard: 'Start with clarity — Fit Check, Possibility Map and Human Experience Review.',
    href: '#review',
    angle: -90,
    tint: 'lavender',
  },
  {
    id: 'improve',
    shortLabel: 'Improve',
    tagline: 'Make the experience or work better',
    placard: 'Remove recurring friction and return time to the humans doing the work.',
    href: '#improve',
    angle: 0,
    tint: 'gold',
  },
  {
    id: 'build',
    shortLabel: 'Build',
    tagline: 'Create something useful with Meish',
    placard: 'Build with Meish or embed us for a week — concrete outcomes, not theory.',
    href: '#build',
    angle: 90,
    tint: 'navy',
  },
  {
    id: 'tools',
    shortLabel: 'Tools',
    tagline: 'Use a focused Meish tool',
    placard: 'Focused instruments when the right tool already exists — ask if you need one now.',
    href: '#tools',
    angle: 180,
    tint: 'red',
  },
];

export function getPublicOffers(): MeishOffer[] {
  return [...meishOffers].sort((a, b) => a.priority - b.priority);
}

export function getOffersByOrbit(orbitId: OrbitId): MeishOffer[] {
  return getPublicOffers().filter((o) => o.orbit === orbitId);
}
