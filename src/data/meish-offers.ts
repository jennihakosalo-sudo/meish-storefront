/**
 * Public Meish offers — single source of truth for Business & landing.
 * Prices verified against MEISH-AI-OFFERS / commercial canon.
 */
import { meishMailto } from '../lib/meish-mailto';

export type PricingState =
  | 'free'
  | 'fixed'
  | 'from'
  | 'gamma'
  | 'request-quote'
  | 'after-fit-check';

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
  type: string;
  summary: string;
  whoFor: string;
  whenUseful: string;
  benefit: string;
  customerInput: string;
  meishInput: string;
  price: string;
  pricingState: PricingState;
  priceNote?: string;
  duration?: string;
  category: OfferCategory;
  orbit: OrbitId;
  priority: number;
  cta: string;
  ctaHref: string;
  includes: string[];
  /** Gamma is a STATUS, not part of the product name. */
  gammaTestPhase?: boolean;
  /** Purchasable ladder vs free Fit Check (shown only as fallback). */
  ladder?: boolean;
  showOnLanding?: boolean;
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

function offerMailto(product: string, cta: string) {
  return meishMailto({
    product,
    page: 'For Your Business',
    section: 'Offers',
    cta,
  });
}

export const meishOffers: MeishOffer[] = [
  {
    id: 'possibility-map',
    name: 'Possibility Map',
    type: 'Product',
    summary:
      'See where AI and Meish can actually create value in your business — three concrete routes, one recommendation, and 30-day actions.',
    whoFor: 'B2B entrepreneurs and decision-makers',
    whenUseful: 'You need a clear direction before building or buying more tools.',
    benefit:
      'You leave with three routes, one clear recommendation, 30-day actions, and practical guardrails.',
    customerInput: 'About 60 minutes for the interview; review time for the walkthrough.',
    meishInput: 'Human interview, synthesis and recommendation; AI supports mapping and review.',
    price: '€590 + VAT 25.5%',
    pricingState: 'gamma',
    priceNote: 'Regular price €950 + VAT 25.5%',
    duration: 'Delivered within five business days of the interview',
    category: "SEE WHAT'S POSSIBLE",
    orbit: 'review',
    priority: 1,
    cta: 'Ask about Possibility Map',
    ctaHref: offerMailto('Possibility Map', 'Ask about Possibility Map'),
    gammaTestPhase: true,
    ladder: true,
    showOnLanding: true,
    includes: [
      '60-minute client interview',
      'Visible Possibility Map',
      'Three distinct progression options',
      'Recommendation for the first implementation',
      'Practical guidance for the next 30 days',
      'AI tools review — edge, time saved, new business angles',
      '30-minute results walkthrough',
    ],
  },
  {
    id: 'build-with-meish',
    name: 'Build with Meish',
    type: 'Service',
    summary: 'Turn one useful opportunity into something concrete in a focused working session.',
    whoFor: 'Decision-makers who already know what is worth building',
    whenUseful: 'After you know the opportunity — and need it made.',
    benefit: 'One selected AI / Meish solution designed, scoped and ready for its next step.',
    customerInput: '3–4 hour joint working session with a clear goal.',
    meishInput: 'Human-led build with AI where it saves time without removing understanding.',
    price: '€790 + VAT 25.5%',
    pricingState: 'fixed',
    duration: '3–4 hours',
    category: 'BUILD SOMETHING USEFUL',
    orbit: 'build',
    priority: 2,
    cta: 'Ask about Build with Meish',
    ctaHref: offerMailto('Build with Meish', 'Ask about Build with Meish'),
    ladder: true,
    showOnLanding: true,
    includes: [
      'Joint working session with a clear goal and concrete outcome',
      'One useful AI solution, tool or workflow for your business',
      'Documentation so you can continue independently',
    ],
  },
  {
    id: 'friction-removal',
    name: 'Meish Friction Removal',
    type: 'Service',
    summary: 'Find and remove unnecessary work — repeated tasks, unclear processes and avoidable friction.',
    whoFor: 'Businesses where friction is consuming meaningful time',
    whenUseful: 'Something is slowing the team down, but you do not yet know where.',
    benefit: 'Friction map, 3–7 concrete interventions, prioritised implementation.',
    customerInput: 'Participation across assessment and rollout conversations.',
    meishInput: 'Human assessment and design; tools where they reduce friction.',
    price: 'from €1,899 + VAT 25.5%',
    pricingState: 'from',
    duration: 'Scoped after assessment',
    category: 'REMOVE FRICTION',
    orbit: 'improve',
    priority: 3,
    cta: 'Ask about Friction Removal',
    ctaHref: offerMailto('Friction Removal', 'Ask about Friction Removal'),
    ladder: true,
    showOnLanding: true,
    includes: [
      'Workflow and friction mapping',
      '3–7 practical solutions or tools',
      'Operating models for your context',
      'Clear rollout instructions',
      'Target: recover at least five work hours per week where realistic',
    ],
  },
  {
    id: 'human-experience-review',
    name: 'Human Experience Review',
    type: 'Service',
    summary:
      'Understand how the experience actually feels — and what would make it better.',
    whoFor: 'Hotels, venues, services, journeys and spaces where human experience matters',
    whenUseful: 'You need the lived experience — not only process metrics.',
    benefit: 'Friction made visible with realistic alternatives you can act on.',
    customerInput: 'Access to the place or journey; follow-up conversation.',
    meishInput: 'Human review from within the experience.',
    price: 'Scope & price after a free Fit Check',
    pricingState: 'after-fit-check',
    category: 'LOOK AT THE WHOLE EXPERIENCE',
    orbit: 'review',
    priority: 4,
    cta: 'Ask about Human Experience Review',
    ctaHref: offerMailto('Human Experience Review', 'Ask about Human Experience Review'),
    ladder: true,
    showOnLanding: false,
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
    type: 'Service',
    summary: 'Bring Meish into the real work for a week — hands-on, not only diagnosis.',
    whoFor: 'Teams that need Meish inside the actual work for a focused week',
    whenUseful: 'A map or one tool is not enough — you need Meish working alongside you.',
    benefit: 'Built solutions, operating models, and follow-up so the change continues.',
    customerInput: 'Availability across the week for co-working and decisions.',
    meishInput: 'Full human presence for the week; AI where it accelerates delivery.',
    price: 'from €7,500 + VAT 25.5%',
    pricingState: 'from',
    duration: '1 week + 2 × 45 min follow-up',
    category: 'BRING MEISH IN',
    orbit: 'build',
    priority: 5,
    cta: 'Ask about A Week with Meish',
    ctaHref: offerMailto('A Week with Meish', 'Ask about A Week with Meish'),
    ladder: true,
    showOnLanding: true,
    includes: [
      'One week of practical co-working inside your business',
      'Built solutions and operating models for your actual work',
      'Written continuation guidance',
      'Two 45-minute follow-up conversations',
    ],
  },
  {
    id: 'fit-check',
    name: '20-minute Fit Check',
    type: 'Service',
    summary:
      'A quick conversation to see whether there is a useful Meish / AI opportunity — and what should happen first.',
    whoFor: 'B2B entrepreneurs and decision-makers when the next step is still unclear',
    whenUseful: 'You are not sure which offer fits — or whether Meish is useful here.',
    benefit: 'Find the right first step. No preparation required.',
    customerInput: '20 minutes. No preparation required.',
    meishInput: 'Human conversation. AI may support notes only.',
    price: '€0',
    pricingState: 'free',
    duration: '20 min',
    category: 'START HERE',
    orbit: 'review',
    priority: 90,
    cta: 'Book a Fit Check',
    ctaHref: meishMailto({
      product: '20-minute Fit Check',
      page: 'For Your Business',
      section: 'Fit Check fallback',
      cta: 'Book a Fit Check',
    }),
    ladder: false,
    showOnLanding: false,
    includes: [
      'Conversation about your situation and goals',
      'Whether there is a useful Meish opportunity',
      'A clear recommendation for the right first step',
    ],
  },
];

export const orbitGroups: OrbitGroup[] = [
  {
    id: 'review',
    shortLabel: 'Review',
    tagline: 'Understand what is actually happening',
    placard: 'Possibility Map and Human Experience Review — clarity before big builds.',
    href: '#products',
    angle: -90,
    tint: 'lavender',
  },
  {
    id: 'improve',
    shortLabel: 'Improve',
    tagline: 'Make the experience or work better',
    placard: 'Remove recurring friction and return time to the humans doing the work.',
    href: '#products',
    angle: 0,
    tint: 'gold',
  },
  {
    id: 'build',
    shortLabel: 'Build',
    tagline: 'Create something useful with Meish',
    placard: 'Build with Meish or embed us for a week — concrete outcomes, not theory.',
    href: '#products',
    angle: 90,
    tint: 'navy',
  },
  {
    id: 'tools',
    shortLabel: 'Tools',
    tagline: 'Use a focused Meish tool',
    placard: 'Focused instruments when the right tool already exists.',
    href: '/tools',
    angle: 180,
    tint: 'red',
  },
];

export function getPublicOffers(): MeishOffer[] {
  return [...meishOffers].sort((a, b) => a.priority - b.priority);
}

/** Purchasable / quote ladder — excludes free Fit Check. */
export function getLadderOffers(): MeishOffer[] {
  return getPublicOffers().filter((o) => o.ladder !== false && o.id !== 'fit-check');
}

export function getLandingOffers(): MeishOffer[] {
  return getPublicOffers().filter((o) => o.showOnLanding === true);
}

export function getOffersByOrbit(orbitId: OrbitId): MeishOffer[] {
  return getPublicOffers().filter((o) => o.orbit === orbitId);
}

export function getFitCheckOffer(): MeishOffer | undefined {
  return meishOffers.find((o) => o.id === 'fit-check');
}
