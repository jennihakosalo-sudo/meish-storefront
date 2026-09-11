/**
 * Customer-facing copy for the public Meish site.
 *
 * Everything a non-developer might reasonably want to change — headings,
 * sentences, product names, prices, button labels, the contact address —
 * lives here so that editing copy never means editing layout.
 *
 * Rules that matter when editing:
 *   · Prices are written exactly as they should appear, VAT wording included.
 *     Never assemble a price from parts elsewhere.
 *   · One sentence per product. If it needs two, the product needs its own page.
 *   · Every action says what happens next. No "learn more".
 */

/* --- Contact -------------------------------------------------------------- */

export const CONTACT_EMAIL = 'moona.m@meish.work';

/**
 * A mailto with a subject the recipient can sort on. Body is left empty on
 * purpose: a pre-filled message is one more thing to delete before writing.
 */
export const mailTo = (subject: string) =>
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;

/* --- Brand ---------------------------------------------------------------- */

export const brand = {
  name: 'Meish',
  /** Primary line. Belongs to the homepage hero. */
  line: 'Designed around being human.',
  /** Secondary line. Used on About. */
  support: 'Built for human experience.',
  diamond: '/brand/meish-diamond-master-transparent.png',
};

/* --- Navigation ----------------------------------------------------------- */

export const nav: { href: string; label: string; prefix?: string }[] = [
  { href: '/for-business', label: 'Business', prefix: 'For' },
  { href: '/for-your-space', label: 'Space', prefix: 'For' },
  { href: '/tools', label: 'Tools' },
  { href: '/about', label: 'About' },
];

/**
 * The single action on the site. Every page ends here, and the header carries
 * it too.
 *
 * It used to be a named, priced product — the 20-minute Fit Check — with its
 * own route. That put a small free thing in the position of the offer and
 * asked a visitor to book a meeting before they knew what was for sale. The
 * conversation still happens; it is now simply what a reply to this address
 * leads to, rather than something to be chosen from a menu.
 */
export const contactAction = {
  label: 'Email Meish',
  href: mailTo('Meish'),
};

/* --- Hero images -----------------------------------------------------------
   The homepage uses lobby-drawn: the approved lobby-man scene redrawn
   in the pencil-and-wash family. Photographic lobby-man stays on disk.
   The other four open Business, Space, Tools and About.

   The files are built by scripts/hero-images.mjs. `scrim` is how much the
   photograph has to be darkened to keep ivory copy legible on it — a property
   of the picture, not of the layout, which is why it travels with it.
   ------------------------------------------------------------------------ */

const heroImage = (slug: string, scrim: number, alt: string) => ({
  landscape: `/images/hero/${slug}-landscape-1280.webp`,
  landscapeWidths: [640, 960, 1280],
  portrait: `/images/hero/${slug}-portrait-720.webp`,
  portraitWidths: [480, 720],
  scrim,
  alt,
});

export const heroImages = {
  home: heroImage(
    'lobby-drawn',
    0.52,
    'A man standing still in a tall lobby, observing the space while someone walks past.',
  ),
  business: heroImage(
    'three-options',
    0.48,
    'Three printed options on a table, one pulled forward.',
  ),
  space: heroImage(
    'two-routes',
    0.38,
    'A public interior with two walking routes visible as motion trails.',
  ),
  tools: heroImage(
    'before-after',
    0.38,
    'A corridor wall that clears from crowded notices to one simple bench.',
  ),
  about: heroImage(
    'hesitation',
    0.36,
    'A person paused just inside an entrance, looking for which way to go.',
  ),
};

/* --- Hero ----------------------------------------------------------------- */

export const hero = {
  line: brand.line,
  lead: 'We notice what matters, compare what could come next and turn the right direction into something useful.',
  /* One action only, and it goes to a page rather than to the next section —
     a button that scrolls one screen down decides nothing. Business is where
     the work and the prices become concrete. Writing to us belongs at the foot
     of the page, not here, where it would ask a visitor to make contact before
     they know what is on offer. */
  action: { label: 'Discover more', href: '/for-business' },
  image: heroImages.home,
};

/* --- Subpage heroes --------------------------------------------------------
   Each page opens with its own photograph and its own first sentence. No
   button: the page itself is the answer to having clicked, and an action here
   would only send a visitor away from what they just arrived at.
   ------------------------------------------------------------------------ */

export const pageHeroes = {
  business: {
    eyebrow: 'This may interest you if you are an entrepreneur, CEO or team lead.',
    line: 'The hard part is rarely a lack of options.',
    lead: 'It is knowing which one deserves to move, and what the first honest test of it would be. That is the work.',
    image: heroImages.business,
  },
  space: {
    eyebrow: 'This may interest you if you run a place people move through.',
    line: 'Do not design only the room. Design what happens there.',
    lead: 'A space is already influencing behaviour — where people pause, what they do first, what they never notice. Meish looks at that before anything is moved, bought or rebuilt.',
    image: heroImages.space,
  },
  tools: {
    eyebrow: 'Meish Tools',
    line: 'A tool should be smaller than the problem.',
    lead: 'Each of these does one thing, in one situation, and can be put down afterwards. None of them is a platform, and none of them needs an account.',
    image: heroImages.tools,
  },
  about: {
    eyebrow: 'About Meish',
    line: brand.support,
    lead: 'Every experience is designed — on purpose or by accident. Meish looks at what is actually happening for the people inside one, and turns that into something useful: a direction, a change, a tool, or the decision to leave it alone.',
    image: heroImages.about,
  },
};

/* --- Core message ---------------------------------------------------------
   The clearest question a prospective client can be asked, and the shortest
   possible answer.
   ------------------------------------------------------------------------ */

export const coreMessage = {
  question: 'Do you know what your customers actually experience and notice?',
  answer: 'Meish finds out.',
  body: [
    'We make real customer experience observable: what people notice, what they miss, what creates trust or uncertainty, what stays with them — and what actually matters.',
    'Our work is based on real, traceable observations and clear assessments of what is significant to the customer experience.',
  ],
};

/* --- For example ---------------------------------------------------------- */

/* Each entry answers three things in order: when to get in touch, what we
   would actually do, and what the client ends up with. Situations, not
   shortcomings — nobody recognises themselves in a description of a deficit. */

export interface Example {
  who: string;
  what: string[];
  accent: string;
  product?: { name: string; tagline: string };
  /**
   * The product this situation leads to. The three sentences above are the
   * clearest description of that product we have, so the product pages read
   * them from here rather than restating them in different words — two
   * descriptions of one service is how they start to disagree.
   */
  productSlug?: string;
  /** Public page and product anchor this situation leads to. */
  href?: string;
}

export const examples: Example[] = [
  {
    who: 'A company',
    what: [
      'Contact us when your business has several possible directions and you need to decide which one is worth pursuing.',
      'We identify realistic opportunities and help assess which one deserves a practical test.',
      'This could mean a new product, customer group, service, way of working or commercial direction.',
    ],
    accent: 'var(--deep-orbit-indigo)',
    productSlug: 'recognition-sprint',
    href: '/for-business#recognition-sprint',
  },
  {
    who: 'A hotel or service',
    what: [
      'Contact us when you want to know what your customers actually experience and notice.',
      'We can observe the real customer journey — including arrival, service, spaces, cleanliness, sensory experience and departure — and assess which observations genuinely matter.',
      'The result helps distinguish what should be kept, changed, tested or left alone.',
    ],
    accent: 'var(--resonance-violet)',
    productSlug: 'human-experience-review',
    href: '/for-business#human-experience-review',
  },
  {
    who: 'A leader',
    what: [
      'Contact us when valuable thinking, experience or working philosophy exists mostly in your head and deserves to become usable.',
      'We interview you to uncover and structure what you know, think and have learned — including knowledge that may never have been written down.',
      'That thinking can then become useful material such as LinkedIn posts, training material, talks, working principles or other content.',
    ],
    accent: 'var(--alignment-gold)',
    product: {
      name: 'Meish Thought Leadership Sprint',
      tagline: 'Your thinking is valuable. Make it visible.',
    },
    productSlug: 'thought-leadership-sprint',
    href: '/for-business#thought-leadership-sprint',
  },
  {
    who: 'A space',
    what: [
      'Contact us when the purpose of a space is changing or the way the space is used needs to change.',
      'Before designing solutions, we observe how people use the space now, what actually happens there and what the space should enable in the future.',
      'We then assess what should be kept, what should change and what may not need to be done at all.',
    ],
    accent: 'var(--lucent-teal)',
    productSlug: 'behavior-composition-audit',
    href: '/for-your-space#behavior-composition-audit',
  },
];

/* --- Products ------------------------------------------------------------- */

export interface Product {
  slug: string;
  category: string;
  name: string;
  promise: string;
  /**
   * The promise compressed to one scannable line, for the row directly under
   * the hero. It says nothing the promise does not already say — it is the
   * same claim, short enough to read in a glance.
   */
  outcome?: string;
  /**
   * Written exactly as it should be read, VAT wording included. Absent means
   * no price has been set yet — the product is then shown without one rather
   * than with a made-up figure or a vague "on request".
   */
  price?: string;
  accent: string;
  cta: { label: string; href: string };
}

/**
 * The three products the homepage leads with. Everything the homepage maps
 * over reads this list, so adding a fourth here puts it on the homepage.
 */
export const products: Product[] = [
  {
    slug: 'recognition-sprint',
    category: 'Business',
    name: 'Recognition Sprint',
    promise:
      'Find the strongest next direction, connect it to evidence and a euro hypothesis, and define the first test.',
    outcome: 'Know which direction is worth testing first.',
    price: 'From €590 + VAT',
    accent: 'var(--deep-orbit-indigo)',
    cta: { label: 'Email about Recognition Sprint', href: mailTo('Recognition Sprint') },
  },
  {
    slug: 'human-experience-review',
    category: 'Experience',
    name: 'Human Experience Review',
    promise:
      'Observe one defined service, journey or experience area and turn real human signals into practical decisions.',
    outcome: 'See what your customers actually experience.',
    price: 'From €950 + VAT',
    accent: 'var(--resonance-violet)',
    cta: { label: 'Email about Human Experience Review', href: mailTo('Human Experience Review') },
  },
  {
    slug: 'behavior-composition-audit',
    category: 'Space',
    name: 'Behavior & Composition Audit',
    promise: 'Understand how people actually use a space before deciding what it should support.',
    outcome: 'See how people really use your space.',
    price: '€690 + VAT',
    accent: 'var(--lucent-teal)',
    cta: {
      label: 'Email about Behavior & Composition Audit',
      href: mailTo('Behavior & Composition Audit'),
    },
  },
];

/**
 * Named on the homepage inside the "A leader" situation, but not one of the
 * three the homepage sells, so it lives beside the list rather than in it.
 */
export const thoughtLeadershipSprint: Product = {
  slug: 'thought-leadership-sprint',
  category: 'Leadership',
  name: 'Meish Thought Leadership Sprint',
  promise: 'Your thinking is valuable. Make it visible.',
  price: 'From €690 + VAT',
  accent: 'var(--alignment-gold)',
  cta: {
    label: 'Email about Thought Leadership Sprint',
    href: mailTo('Meish Thought Leadership Sprint'),
  },
};

const allProducts = [...products, thoughtLeadershipSprint];

export const getProduct = (slug: string) => allProducts.find((p) => p.slug === slug);

/* --- Product detail -------------------------------------------------------
   A product and the situation that leads to it, joined. The three sentences
   come from `examples` and are not restated here: when to get in touch, what
   we would do, what you end up with.
   ------------------------------------------------------------------------ */

export interface ProductDetail extends Product {
  /** When to get in touch, what we do, what you end up with. */
  what: string[];
}

export const getProductDetail = (slug: string): ProductDetail => {
  const product = getProduct(slug);
  if (!product) throw new Error(`Unknown product: ${slug}`);
  const situation = examples.find((e) => e.productSlug === slug);
  if (!situation) throw new Error(`No situation describes product: ${slug}`);
  return { ...product, what: situation.what };
};

/* --- Small practical tools ------------------------------------------------ */

export const toolSets = {
  heading: 'Small practical tools',
  lead: 'Three tools around one useful skill.',
  price: 'From €49',
  cta: { label: 'Explore tools', href: '/tools' },
  sets: [
    { name: 'Clarity', skill: 'Knowing what is actually being decided.', accent: 'var(--lucent-teal)' },
    { name: 'Flow', skill: 'A week that runs without friction you stopped noticing.', accent: 'var(--orbit-ember)' },
    {
      name: 'Human signals',
      skill: 'Noticing the signals people give through behaviour, choices and interaction.',
      accent: 'var(--resonance-violet)',
    },
  ],
};

/* --- Recognition before creation ------------------------------------------ */

export const recognition = {
  heading: 'We don’t start with the solution.',
  body: 'We observe what is already here, recognize what matters and make different possibilities visible. Then we choose what deserves to move forward.',
  steps: [
    { label: 'Notice', note: 'Look at what is actually here.', accent: 'var(--lucent-teal)' },
    {
      label: 'Recognize',
      note: 'Separate what matters from what is merely present.',
      accent: 'var(--deep-orbit-indigo)',
    },
    {
      label: 'Imagine',
      note: 'Make several real possibilities visible.',
      accent: 'var(--resonance-violet)',
    },
    { label: 'Choose', note: 'Compare them and pick what deserves to move.', accent: 'var(--alignment-gold)' },
    {
      label: 'Make real',
      note: 'Build it, simplify it — or leave it alone.',
      accent: 'var(--orbit-ember)',
    },
  ],
};

/* --- Closing section ------------------------------------------------------
   The page ends by removing the reason people talk themselves out of writing:
   the belief that they need a finished brief first.
   ------------------------------------------------------------------------ */

/* --- Scale of work --------------------------------------------------------
   Examples of range, not packages. €590 is the Recognition Sprint floor.
   The larger figures are scale markers only — they do not name a product.
   ------------------------------------------------------------------------ */

export const pricingScale = {
  line: 'Meish can begin with one focused question — or grow into a larger build.',
  note: 'Examples of engagement scale — not fixed packages. Prices exclude VAT. Custom, multi-location and ongoing work available.',
  steps: [
    { label: 'Start small', price: 'from €590' },
    { label: 'Defined project', price: 'from €2,900' },
    { label: 'Deeper build', price: 'from €5,900' },
    { label: 'Larger engagement', price: 'from €10,000' },
    { label: 'Build with Meish', price: 'from €20,000+' },
  ],
};

export const closing = {
  eyebrow: 'Not sure where to start?',
  heading: 'You do not need a finished brief.',
  intro: 'You can write to us about:',
  bring: [
    'an unfinished idea',
    'several possible directions',
    'something you want to create',
    'something you want to understand',
    'something already good that could become more',
  ],
  weDo: 'We look at the situation, say what seems worth exploring, and decide together whether there is a useful next step.',
  leaveWith:
    'You end up with a clearer direction, a useful question, a product match, a small next test, or a clear decision not to proceed.',
  noPressure: 'No pressure.',
};
