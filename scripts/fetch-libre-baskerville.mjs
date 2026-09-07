/**
 * Self-hosts Libre Baskerville.
 *
 * Google's CSS endpoint returns one @font-face per weight/style/subset with an
 * opaque hashed filename. This walks those blocks, downloads each woff2 and
 * names it after what it actually is, then prints the @font-face rules to
 * paste into fonts.css. Run once; the files are then committed with the repo
 * and no request ever leaves the visitor's browser.
 *
 *   node scripts/fetch-libre-baskerville.mjs
 */
import { writeFile, mkdir } from 'node:fs/promises';

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/120.0 Safari/537.36';

/* Asked for all three styles in one call, Google answers with a variable font
   and points 400 and 700 at the same file — which then gets saved twice under
   two names and downloaded twice by the browser. Requesting each style on its
   own returns genuine static faces, one file per weight. */
   There is no italic here on purpose: the public site sets no italic type, so
   fetching an italic face would only ship bytes nobody downloads. */
const SPECS = [
  { query: 'wght@400', weight: '400', italic: false },
  { query: 'wght@700', weight: '700', italic: false },
];

const css = (
  await Promise.all(
    SPECS.map(async (spec) => {
      const url = `https://fonts.googleapis.com/css2?family=Libre+Baskerville:${spec.query}&display=swap`;
      return (await fetch(url, { headers: { 'User-Agent': UA } })).text();
    }),
  )
).join('\n');

/* Each rule is preceded by a `/* subset *\/` comment. Splitting on @font-face
   puts that comment at the tail of the *previous* chunk, so the subset has to
   be read by source position rather than per chunk — getting this wrong
   silently writes two different faces to the same filename. */
const comments = [...css.matchAll(/\/\*\s*([a-z-]+)\s*\*\//g)].map((m) => ({
  at: m.index,
  subset: m[1],
}));
const subsetAt = (index) => {
  let found = 'latin';
  for (const c of comments) {
    if (c.at > index) break;
    found = c.subset;
  }
  return found;
};

const blocks = [...css.matchAll(/@font-face\s*\{([^}]+)\}/g)].map((m) => {
  const body = m[1];
  const url = body.match(/url\((https:\/\/[^)]+\.woff2)\)/);
  const weight = body.match(/font-weight:\s*(\d+)/);
  const style = body.match(/font-style:\s*(\w+)/);
  const range = body.match(/unicode-range:\s*([^;]+);/);
  return {
    subset: subsetAt(m.index),
    url: url ? url[1] : null,
    weight: weight ? weight[1] : '400',
    italic: style?.[1] === 'italic',
    range: range ? range[1].trim() : null,
  };
}).filter((b) => b.url);

const wanted = blocks.filter((b) => b.subset === 'latin' || b.subset === 'latin-ext');
await mkdir('public/fonts', { recursive: true });

const faces = [];
for (const b of wanted) {
  const name = `libre-baskerville-${b.weight}${b.italic ? '-italic' : ''}-${b.subset}.woff2`;
  const bytes = Buffer.from(await (await fetch(b.url, { headers: { 'User-Agent': UA } })).arrayBuffer());
  await writeFile(`public/fonts/${name}`, bytes);
  console.log(`  ${name}  ${(bytes.length / 1024).toFixed(1)} kB`);
  faces.push(
    [
      '@font-face {',
      "  font-family: 'Libre Baskerville';",
      `  font-style: ${b.italic ? 'italic' : 'normal'};`,
      `  font-weight: ${b.weight};`,
      '  font-display: swap;',
      `  src: url('/fonts/${name}') format('woff2');`,
      b.range ? `  unicode-range: ${b.range};` : null,
      '}',
    ]
      .filter(Boolean)
      .join('\n'),
  );
}

await writeFile('public/fonts/.libre-baskerville-faces.css', faces.join('\n\n') + '\n');
console.log(`\n  ${faces.length} faces written. Rules in public/fonts/.libre-baskerville-faces.css`);
