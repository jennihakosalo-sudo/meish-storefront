/**
 * The Meish offer set.
 *
 * A product card answers five things and stops: what category it belongs to,
 * what it is called, what the customer actually gets, what it costs, and what
 * to do next. Anything longer belongs on the product's own page.
 *
 * Prices are published exactly as they should be read, including VAT wording.
 * Never assemble a price string at the call site — a price that is built from
 * parts is a price that eventually renders wrong.
 */
import { meishMailto } from '../lib/meish-mailto';

export type Audience = 'business' | 'you' | 'space' | 'start';

export interface MeishProduct {
  slug: string;
  /** Small label above the name. The customer's own situation, not our taxonomy. */
  category: string;
  name: string;
  /** One sentence. What the customer gets — not what we do. */
  promise: string;
  /** Public price, read exactly as written. */
  price: string;
  /** The single action. */
  cta: { label: string; href: string };
  audiences: Audience[];
  /** Signal colour for this product's node and rule. */
  accent: string;
  /** Lower sorts earlier. */
  order: number;
}

const ask = (product: string, page = 'Offers') =>
  meishMailto({ product, page, section: 'Offers', cta: `Ask about ${product}` });

export const meishProducts: MeishProduct[] = [
  {
    slug: 'recognition-sprint',
    category: 'Business',
    name: 'Recognition Sprint',
    promise:
      'Find the strongest next direction, connect it to evidence and a euro hypothesis, and define the first test.',
    price: 'From €590 + VAT',
    cta: { label: 'Ask about Recognition Sprint', href: ask('Recognition Sprint') },
    audiences: ['business'],
    accent: 'var(--deep-orbit-indigo)',
    order: 1,
  },
  {
    slug: 'human-experience-review',
    category: 'Human Experience',
    name: 'Human Experience Review',
    promise:
      'Observe a service, journey, space or experience and turn real human signals into practical decisions.',
    price: 'From €950 + VAT',
    cta: { label: 'Ask about Human Experience Review', href: ask('Human Experience Review') },
    audiences: ['business', 'space'],
    accent: 'var(--resonance-violet)',
    order: 2,
  },
  {
    slug: 'behavior-composition-audit',
    category: 'Space',
    name: 'Behavior & Composition Audit',
    promise: 'Understand how people actually use a space before deciding what it should support.',
    price: '€690 + VAT',
    cta: {
      label: 'Ask about Behavior & Composition Audit',
      href: ask('Behavior & Composition Audit'),
    },
    audiences: ['space', 'business'],
    accent: 'var(--lucent-teal)',
    order: 3,
  },
  {
    slug: 'leadership-tool-sets',
    category: 'Leadership',
    name: 'Leadership Tool Sets',
    promise:
      'Three small practical tools around one leadership skill: clarity, flow or human signals.',
    price: 'From €49',
    cta: { label: 'See the three sets', href: '/tools#leadership-tool-sets' },
    audiences: ['business', 'you'],
    accent: 'var(--alignment-gold)',
    order: 4,
  },
  {
    slug: 'business-factory',
    category: 'Business / Treasure',
    name: 'Business Factory',
    promise:
      'Create realistic business directions from real skills, resources and desired life — or recover the lost thread of an existing company.',
    price: 'Pilot from €590 + VAT',
    cta: { label: 'Ask about Business Factory', href: ask('Business Factory') },
    audiences: ['business', 'you'],
    accent: 'var(--orbit-ember)',
    order: 5,
  },
];

export const getProduct = (slug: string) => meishProducts.find((p) => p.slug === slug);

export const productsFor = (audience: Audience) =>
  meishProducts.filter((p) => p.audiences.includes(audience)).sort((a, b) => a.order - b.order);

/* --- Leadership Tool Sets -------------------------------------------------
   Presentation only for this build. Each set is three tools around one skill.
   No checkout, no cart, no fulfilment: the brief is explicit that ecommerce
   infrastructure is not part of this website.
   ------------------------------------------------------------------------ */

export interface ToolSet {
  slug: string;
  name: string;
  skill: string;
  tools: string[];
  accent: string;
}

export const leadershipToolSets: ToolSet[] = [
  {
    slug: 'clarity',
    name: 'Clarity',
    skill: 'Knowing what is actually being decided.',
    tools: ['Points of Confusion → Presence', 'Decision Door', 'What Needs to Be True?'],
    accent: 'var(--lucent-teal)',
  },
  {
    slug: 'flow',
    name: 'Flow',
    skill: 'Getting the week to run without friction you have stopped noticing.',
    tools: ['Friction Finder', 'Handoff Check', 'Five Hours Back'],
    accent: 'var(--orbit-ember)',
  },
  {
    slug: 'human-signals',
    name: 'Human Signals',
    skill: 'Noticing the signals people give through behaviour, choices and interaction.',
    tools: ['Uncertainty Load Scan', 'Meeting Aftertaste', 'Signal Before Survey'],
    accent: 'var(--resonance-violet)',
  },
];
