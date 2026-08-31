export interface UniverseNode {
  slug: string;
  title: string;
  summary?: string;
  drawMe?: string;
  taidot?: string[];
  tuotteet?: { name: string; href?: string; note?: string }[];
  kokonaisuudet?: { slug: string; title: string }[];
  ikonit?: string[];
  tyokalut?: string[];
  lapset?: { slug: string; title: string; summary?: string }[];
}

/** Flat registry keyed by full slug path (e.g. business/possibility-map). */
export const universeNodes: Record<string, UniverseNode> = {
  business: {
    slug: 'business',
    title: 'Meish & Your Business',
    summary: 'Practical help for founders and teams — maps, fit checks, and clear next steps.',
    drawMe: 'Business door — compass and map motifs.',
    taidot: [
      'Clarifying goals and constraints',
      'Mapping skills and existing materials',
      'Designing realistic path options',
      'Recommending first implementations',
    ],
    tuotteet: [
      { name: 'Possibility Map', href: '/universe/business/possibility-map', note: '590 € + VAT' },
    ],
    kokonaisuudet: [{ slug: '', title: 'Meish Universe' }],
    ikonit: ['Compass', 'Map pin', 'Door'],
    tyokalut: ['Interview guide', 'Possibility Map canvas', 'AI tools review'],
    lapset: [
      { slug: 'business/possibility-map', title: 'Possibility Map', summary: 'Gamma Test Phase offer' },
    ],
  },

  'business/possibility-map': {
    slug: 'business/possibility-map',
    title: 'Possibility Map',
    summary: 'A visible map of your goals, skills, materials and three path options — delivered in five business days.',
    drawMe: 'Central map sheet with three branching paths.',
    taidot: [
      'Structured client interviews',
      'Synthesising goals and constraints',
      'Visual map production',
      'Path comparison and recommendation',
      '30-day action planning',
      'AI opportunity scanning',
    ],
    tuotteet: [
      { name: 'Possibility Map — Gamma Test', note: '590 € + VAT · 5 business days' },
    ],
    kokonaisuudet: [
      { slug: 'business', title: 'Meish & Your Business' },
      { slug: '', title: 'Meish Universe' },
    ],
    ikonit: ['Map', 'Three paths', 'North star'],
    tyokalut: ['Interview script', 'Map template', 'Delivery checklist'],
    lapset: [
      { slug: 'business/possibility-map/interview', title: 'Interview', summary: '60-minute client session' },
      { slug: 'business/possibility-map/summary', title: 'Summary', summary: 'Goals, skills, materials' },
      { slug: 'business/possibility-map/map', title: 'The Map', summary: 'Visible Possibility Map' },
      { slug: 'business/possibility-map/paths', title: 'Three Paths', summary: 'Different progression options' },
      { slug: 'business/possibility-map/recommendation', title: 'Recommendation', summary: 'First implementation' },
      { slug: 'business/possibility-map/next-30-days', title: 'Next 30 Days', summary: 'Practical guide' },
      { slug: 'business/possibility-map/walkthrough', title: 'Walkthrough', summary: '30-minute results review' },
    ],
  },

  'business/possibility-map/interview': {
    slug: 'business/possibility-map/interview',
    title: 'Interview',
    summary: 'A focused 60-minute conversation to capture goals, skills, materials and context.',
    taidot: ['Active listening', 'Structured questioning', 'Constraint mapping'],
    kokonaisuudet: [
      { slug: 'business/possibility-map', title: 'Possibility Map' },
      { slug: 'business', title: 'Meish & Your Business' },
    ],
    lapset: [],
  },

  'business/possibility-map/summary': {
    slug: 'business/possibility-map/summary',
    title: 'Summary',
    summary: 'Written synthesis of what we heard — goals, skills, assets and open questions.',
    taidot: ['Synthesis', 'Clear writing', 'Gap identification'],
    kokonaisuudet: [{ slug: 'business/possibility-map', title: 'Possibility Map' }],
    lapset: [],
  },

  'business/possibility-map/map': {
    slug: 'business/possibility-map/map',
    title: 'The Map',
    summary: 'The visible Possibility Map — your landscape at a glance.',
    taidot: ['Visual design', 'Information architecture', 'Clarity editing'],
    kokonaisuudet: [{ slug: 'business/possibility-map', title: 'Possibility Map' }],
    lapset: [],
  },

  'business/possibility-map/paths': {
    slug: 'business/possibility-map/paths',
    title: 'Three Paths',
    summary: 'Three genuinely different ways forward — not variations of the same idea.',
    taidot: ['Option design', 'Trade-off analysis', 'Honest comparison'],
    kokonaisuudet: [{ slug: 'business/possibility-map', title: 'Possibility Map' }],
    lapset: [],
  },

  'business/possibility-map/recommendation': {
    slug: 'business/possibility-map/recommendation',
    title: 'Recommendation',
    summary: 'Our suggested first implementation — with reasons you can evaluate.',
    taidot: ['Prioritisation', 'Risk assessment', 'Decision support'],
    kokonaisuudet: [{ slug: 'business/possibility-map', title: 'Possibility Map' }],
    lapset: [],
  },

  'business/possibility-map/next-30-days': {
    slug: 'business/possibility-map/next-30-days',
    title: 'Next 30 Days',
    summary: 'Concrete actions for the first month — small enough to start, big enough to matter.',
    taidot: ['Action planning', 'Sequencing', 'Accountability framing'],
    kokonaisuudet: [{ slug: 'business/possibility-map', title: 'Possibility Map' }],
    lapset: [],
  },

  'business/possibility-map/walkthrough': {
    slug: 'business/possibility-map/walkthrough',
    title: 'Walkthrough',
    summary: 'A 30-minute session to walk through results and answer questions.',
    taidot: ['Presentation', 'Q&A', 'Handover'],
    kokonaisuudet: [{ slug: 'business/possibility-map', title: 'Possibility Map' }],
    lapset: [],
  },
};

export function getUniverseNode(slug: string): UniverseNode | undefined {
  return universeNodes[slug];
}

export function getAllUniverseSlugs(): string[] {
  return Object.keys(universeNodes);
}
