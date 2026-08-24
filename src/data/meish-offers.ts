/**
 * Approved PUBLIC Meish B2B offers — single source of truth for homepage & nav.
 * Shop print catalogue lives in src/data/products.ts (MEI-18).
 */

export type OfferCategory =
  | 'START HERE'
  | 'DISCOVER'
  | 'BUILD'
  | 'IMPROVE'
  | 'CORE MEISH CAPABILITY'
  | 'PREMIUM';

export type OrbitId = 'review' | 'improve' | 'build' | 'tools';

export interface MeishOffer {
  id: string;
  name: string;
  summary: string;
  price: string;
  priceNote?: string;
  duration?: string;
  category: OfferCategory;
  orbit: OrbitId;
  priority: number;
  cta: string;
  ctaHref: string;
  includes: string[];
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
    summary: 'A free 20-minute conversation to see whether Meish is the right partner — and which offer fits first.',
    price: '€0',
    duration: '20 min',
    category: 'START HERE',
    orbit: 'review',
    priority: 1,
    cta: 'BOOK A FIT CHECK',
    ctaHref: 'mailto:jenni@meish.work?subject=Meish%20AI%20Fit%20Check',
    includes: [
      'Short discovery call about your situation and goals',
      'Honest fit assessment — no pitch if we are not the right match',
      'Clear recommendation for your first step with Meish',
    ],
  },
  {
    id: 'possibility-map',
    name: 'Meish Possibility Map',
    summary: 'Structured discovery: your goals, assets and options mapped into a visible plan with three paths forward.',
    price: '€590 + VAT 25.5%',
    priceNote: 'Gamma Test launch price · normal €950 + VAT',
    category: 'DISCOVER',
    orbit: 'review',
    priority: 2,
    cta: "SEE WHAT'S POSSIBLE",
    ctaHref: 'mailto:jenni@meish.work?subject=Meish%20Possibility%20Map',
    includes: [
      '60-minute client interview',
      'Clear summary of goals, skills, materials and opportunities',
      'Visible Possibility Map',
      'Three distinct progression options',
      'Recommendation for the first implementation',
      'Practical guidance for the next 30 days',
      'AI tools review — competitive edge, time saved, new business angles',
      '30-minute results walkthrough',
      'Delivered within five business days of the interview',
    ],
  },
  {
    id: 'build-with-meish',
    name: 'Build with Meish',
    summary: 'Hands-on session to build one useful AI solution, tool or operating model for your business.',
    price: '€790 + VAT 25.5%',
    duration: '3–4 hours',
    category: 'BUILD',
    orbit: 'build',
    priority: 3,
    cta: 'BUILD SOMETHING USEFUL',
    ctaHref: 'mailto:jenni@meish.work?subject=Build%20with%20Meish',
    includes: [
      'Joint working session with a clear goal and concrete outcome',
      'One useful AI solution, tool or workflow built for your business',
      'Documentation so you can continue independently',
    ],
  },
  {
    id: 'friction-removal',
    name: 'Meish Friction Removal',
    summary: 'We map recurring friction in your workflows and deliver practical fixes that return time to your team.',
    price: 'From €1,899 + VAT 25.5%',
    category: 'IMPROVE',
    orbit: 'improve',
    priority: 4,
    cta: 'REMOVE FRICTION',
    ctaHref: 'mailto:jenni@meish.work?subject=Meish%20Friction%20Removal',
    includes: [
      'Workflow and friction mapping across your operations',
      '3–7 practical solutions or tools tailored to your business',
      'Operating models built for your context',
      'Clear rollout instructions',
      'Target: recover at least five work hours per week',
    ],
  },
  {
    id: 'human-experience-review',
    name: 'Human Experience Review',
    summary: 'A structured review of how your service, space or process actually feels — from the human inside it.',
    price: 'Proposal / pilot',
    priceNote: 'Scoped after Fit Check or discovery call',
    category: 'CORE MEISH CAPABILITY',
    orbit: 'review',
    priority: 5,
    cta: 'REVIEW THE EXPERIENCE',
    ctaHref: 'mailto:jenni@meish.work?subject=Human%20Experience%20Review',
    includes: [
      'Lived-experience review of your customer or team journey',
      'Friction made visible with realistic alternatives',
      'Prioritised improvements aligned with human agency',
    ],
    lenses: [
      'Clarity — can people understand, choose and complete?',
      'Smoothness — where does unnecessary effort accumulate?',
      'Agency — who keeps control, understanding and the final decision?',
      'Wellbeing — does the experience create room for meaningful work and life?',
    ],
    applications: [
      'Customer journeys and service touchpoints',
      'Workplace tools, onboarding and internal processes',
      'Physical spaces, events and hybrid experiences',
      'Digital products before major investment',
    ],
  },
  {
    id: 'week-with-meish',
    name: 'A Week with Meish',
    summary: 'Meish embedded alongside your team for a week — building solutions in your real work, not in slides.',
    price: '€7,500 + VAT 25.5%',
    duration: '1 week',
    category: 'PREMIUM',
    orbit: 'build',
    priority: 6,
    cta: 'WORK WITH MEISH',
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
