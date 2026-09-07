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

export const nav = [
  { href: '/for-business', label: 'Business' },
  { href: '/for-your-space', label: 'Space' },
  { href: '/tools', label: 'Tools' },
  { href: '/about', label: 'About' },
];

export const fitCheck = {
  label: 'Fit Check',
  navLabel: 'Fit Check',
  heading: '20-minute Meish Fit Check',
  price: '€0',
  meta: 'Fit Check · 20 min · €0',
  href: mailTo('Meish Fit Check'),
  cta: 'Email Meish about a Fit Check',
};

/* --- Hero ----------------------------------------------------------------- */

export const hero = {
  line: brand.line,
  lead: 'We notice what matters, compare what could come next and turn the right direction into something useful.',
  audience: 'For people and businesses.',
  finnish: 'Palvelemme myös suomeksi.',
  /* One action only. The hero used to carry a second button that scrolled to
     the next section — a choice that decided nothing. */
  action: { label: fitCheck.meta, href: '/fit-check' },
};

/* --- Core message ---------------------------------------------------------
   The clearest question a prospective client can be asked, and the shortest
   possible answer. Stated once in English and once in Finnish; the two are the
   same statement, not two different ones.
   ------------------------------------------------------------------------ */

export const coreMessage = {
  en: {
    question: 'Do you know what your customers actually experience and notice?',
    answer: 'Meish finds out.',
    body: [
      'We make real customer experience observable: what people notice, what they miss, what creates trust or uncertainty, what stays with them — and what actually matters.',
      'Our work is based on real, traceable observations and clear assessments of what is significant to the customer experience.',
    ],
  },
  fi: {
    label: 'Suomeksi',
    question: 'Tiedätkö, mitä asiakkaasi todella kokee ja havaitsee?',
    answer: 'Meish ottaa siitä selvää.',
    body: [
      'Teemme todellisen asiakaskokemuksen näkyväksi: mitä ihmiset huomaavat, mikä jää huomaamatta, mikä synnyttää luottamusta tai epävarmuutta, mikä jää mieleen — ja millä on oikeasti merkitystä.',
      'Työmme perustuu aitoihin ja jäljitettäviin havaintoihin sekä selkeisiin arvioihin siitä, mikä on asiakaskokemuksen kannalta merkittävää.',
    ],
  },
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
  },
  {
    who: 'A hotel or service',
    what: [
      'Contact us when you want to know what your customers actually experience and notice.',
      'We can observe the real customer journey — including arrival, service, spaces, cleanliness, sensory experience and departure — and assess which observations genuinely matter.',
      'The result helps distinguish what should be kept, changed, tested or left alone.',
    ],
    accent: 'var(--resonance-violet)',
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
  },
  {
    who: 'A space',
    what: [
      'Contact us when the purpose of a space is changing or the way the space is used needs to change.',
      'Before designing solutions, we observe how people use the space now, what actually happens there and what the space should enable in the future.',
      'We then assess what should be kept, what should change and what may not need to be done at all.',
    ],
    accent: 'var(--lucent-teal)',
  },
];

/* The same four situations in Finnish. Each one keeps the colour of its
   English counterpart, which is what tells a reader the two lists are one list
   rather than two. The Sprint name and its line stay in English on purpose:
   it is a product name, not a sentence to translate. */

export const examplesFi: { label: string; heading: string; items: Example[] } = {
  label: 'Suomeksi',
  heading: 'Mitä me oikeasti teemme',
  items: [
    {
      who: 'Yritys',
      what: [
        'Ota meihin yhteyttä, kun yritykselläsi on useita mahdollisia suuntia ja pitäisi selvittää, mikä niistä kannattaa viedä eteenpäin.',
        'Tunnistamme realistisia mahdollisuuksia ja autamme arvioimaan, mikä niistä kannattaa viedä käytännön testiin.',
        'Se voi tarkoittaa esimerkiksi uutta tuotetta, asiakasryhmää, palvelua, toimintatapaa tai kaupallista suuntaa.',
      ],
      accent: 'var(--deep-orbit-indigo)',
    },
    {
      who: 'Hotelli tai palvelu',
      what: [
        'Ota meihin yhteyttä, kun haluat tietää, mitä asiakkaasi todella kokee ja havaitsee.',
        'Voimme havainnoida todellista asiakaspolkua — esimerkiksi saapumista, palvelua, tiloja, siisteyttä, aistikokemusta ja lähtöä — ja arvioida, millä havainnoilla on oikeasti merkitystä.',
        'Tulosten perusteella voidaan erottaa, mitä kannattaa säilyttää, muuttaa, testata tai jättää tekemättä.',
      ],
      accent: 'var(--resonance-violet)',
    },
    {
      who: 'Johtaja',
      what: [
        'Ota meihin yhteyttä, kun arvokasta ajattelua, kokemusta tai työfilosofiaa on tarve tehdä näkyväksi.',
        'Haastattelemme sinua. Saat kertoa, mitä ajattelet, tiedät ja osaat — myös sellaista hiljaista tietoa, jota et ehkä ole koskaan tullut ajatelleeksi.',
        'Saat meiltä esimerkiksi LinkedIn-sisältöjä, koulutusmateriaalia, puheenvuoroja, työskentelyperiaatteita tai muuta juuri sinulle käyttökelpoista aineistoa.',
      ],
      accent: 'var(--alignment-gold)',
      product: {
        name: 'Meish Thought Leadership Sprint',
        tagline: 'Your thinking is valuable. Make it visible.',
      },
    },
    {
      who: 'Tila',
      what: [
        'Ota meihin yhteyttä, jos tilan käyttötarkoitus on muuttumassa tai tilankäyttöön tarvitaan muutoksia.',
        'Ennen ratkaisujen suunnittelua selvitämme, miten ihmiset käyttävät tilaa nyt, mitä siellä todella tapahtuu ja mitä tilan pitäisi jatkossa mahdollistaa.',
        'Sen perusteella arvioimme, mitä kannattaa säilyttää, mitä muuttaa ja mitä ei tarvitse tehdä lainkaan.',
      ],
      accent: 'var(--lucent-teal)',
    },
  ],
};

/* --- Products ------------------------------------------------------------- */

export interface Product {
  slug: string;
  category: string;
  name: string;
  promise: string;
  price: string;
  accent: string;
  cta: { label: string; href: string };
}

export const products: Product[] = [
  {
    slug: 'recognition-sprint',
    category: 'Business',
    name: 'Recognition Sprint',
    promise:
      'Find the strongest next direction, connect it to evidence and a euro hypothesis, and define the first test.',
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
    price: 'From €950 + VAT',
    accent: 'var(--resonance-violet)',
    cta: { label: 'Email about Human Experience Review', href: mailTo('Human Experience Review') },
  },
  {
    slug: 'behavior-composition-audit',
    category: 'Space',
    name: 'Behavior & Composition Audit',
    promise: 'Understand how people actually use a space before deciding what it should support.',
    price: '€690 + VAT',
    accent: 'var(--lucent-teal)',
    cta: {
      label: 'Email about Behavior & Composition Audit',
      href: mailTo('Behavior & Composition Audit'),
    },
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

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

/* --- Fit Check section ---------------------------------------------------- */

export const fitCheckSection = {
  eyebrow: 'Not sure where to start?',
  heading: fitCheck.heading,
  price: fitCheck.price,
  intro: 'You do not need a finished brief. You can bring:',
  bring: [
    'an unfinished idea',
    'several possible directions',
    'something you want to create',
    'something you want to understand',
    'something already good that could become more',
  ],
  inTwenty:
    'In twenty minutes we look at the situation, identify what seems worth exploring, and decide whether there is a useful next step.',
  leaveWith:
    'You leave with a clearer direction, a useful question, a product match, a small next test, or a clear decision not to proceed.',
  noPressure: 'No pressure.',
};
