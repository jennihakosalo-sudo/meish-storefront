/**
 * Machine-readable sellable services. Only offers with a defined public
 * output. Business Factory is visible on /for-business but is not listed
 * here: PUBLIC CONTENT — SEMANTIC PRODUCT DEFINITION PENDING.
 *
 * Fit Check, Possibility Map, Table of Elements and Entities-as-product
 * are not included.
 */
import { SITE_ORIGIN } from '../lib/meish-mailto';
import {
  examples,
  getProduct,
  thoughtLeadershipSprint,
  toolSets,
} from './site-content';
import { getProduct as getCatalogProduct } from './meish-products';

interface DefinedService {
  slug: string;
  url: string;
  who: string;
  situation: string;
  does: string;
  gets: string;
}

const defined: DefinedService[] = [
  {
    slug: 'recognition-sprint',
    url: `${SITE_ORIGIN}/for-business/#recognition-sprint`,
    who: 'A company, entrepreneur, CEO or team lead.',
    situation:
      'The business has several possible directions and needs to decide which one is worth pursuing.',
    does: 'Identify realistic opportunities and assess which one deserves a practical test, connected to evidence and a euro hypothesis.',
    gets: 'Know which direction is worth testing first.',
  },
  {
    slug: 'human-experience-review',
    url: `${SITE_ORIGIN}/for-business/#human-experience-review`,
    who: 'A hotel, service or other experience owner.',
    situation: 'You want to know what your customers actually experience and notice.',
    does: 'Observe one defined service, journey, space or experience and assess which observations genuinely matter.',
    gets: 'Practical decisions: what should be kept, changed, tested or left alone.',
  },
  {
    slug: 'behavior-composition-audit',
    url: `${SITE_ORIGIN}/for-your-space/#behavior-composition-audit`,
    who: 'Someone responsible for a place people move through.',
    situation: 'The purpose of a space is changing, or the way it is used needs to change.',
    does: 'Observe how people actually use the space before deciding what it should support.',
    gets: 'An assessment of what should be kept, what should change, and what may not need to be done at all.',
  },
  {
    slug: 'thought-leadership-sprint',
    url: `${SITE_ORIGIN}/for-business/#thought-leadership-sprint`,
    who: 'A leader, expert or entrepreneur.',
    situation:
      'Valuable thinking, experience or working philosophy exists mostly in your head and deserves to become usable.',
    does: 'Interview you to uncover and structure what you know, think and have learned — including tacit knowledge.',
    gets: 'Useful material such as LinkedIn posts, training material, talks, working principles or another agreed useful format.',
  },
  {
    slug: 'leadership-tool-sets',
    url: `${SITE_ORIGIN}/tools/#leadership-tool-sets`,
    who: 'A leader working on one skill: clarity, flow or human signals.',
    situation: 'A small practical instrument is enough; a platform is not.',
    does: 'Three printed tools around one leadership skill.',
    gets: 'The chosen set, sent after you write. Not purchasable on the site.',
  },
];

function priceOf(slug: string): string | undefined {
  if (slug === 'thought-leadership-sprint') return thoughtLeadershipSprint.price;
  if (slug === 'leadership-tool-sets') return getCatalogProduct(slug)?.price ?? toolSets.price;
  return getProduct(slug)?.price;
}

export function publicServiceGraph(): Record<string, unknown>[] {
  return defined.map((s) => {
    const product = s.slug === 'leadership-tool-sets' ? getCatalogProduct(s.slug) : getProduct(s.slug);
    const example = examples.find((e) => e.productSlug === s.slug);
    const price = priceOf(s.slug);
    const description = [s.does, s.gets, example?.what.join(' ')].filter(Boolean).join(' ');

    const node: Record<string, unknown> = {
      '@type': 'Service',
      '@id': `${s.url}-service`,
      name: product?.name ?? s.slug,
      description,
      url: s.url,
      provider: { '@id': `${SITE_ORIGIN}/#organization` },
      audience: { '@type': 'Audience', audienceType: s.who },
    };

    if (price) {
      node.offers = {
        '@type': 'Offer',
        priceCurrency: 'EUR',
        description: price,
        url: s.url,
      };
    }

    return node;
  });
}
