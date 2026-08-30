#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const locked = [
  {
    path: 'public/brand/meish-diamond-intensive.png',
    sha256: '3ec3ac4e57f54cc0530cb384d41225907ac74d4fc11250ccd139c11df861ba01',
  },
  {
    path: 'public/brand/meish-universe-lockup-cream.png',
    sha256: 'e422584ba940ee6f5a52d3ed93f87c84322ccdd0e487fb0c522486be6bc8b4d1',
  },
];

let failed = false;

for (const asset of locked) {
  const full = resolve(root, asset.path);
  if (!existsSync(full)) {
    console.error(`BRAND LOCK FAIL: missing ${asset.path}`);
    failed = true;
    continue;
  }
  const sha = createHash('sha256').update(readFileSync(full)).digest('hex');
  if (sha !== asset.sha256) {
    console.error(`BRAND LOCK FAIL: ${asset.path} bytes changed`);
    console.error(`  expected ${asset.sha256}`);
    console.error(`  actual   ${sha}`);
    failed = true;
  }
}

if (failed) {
  console.error('DO NOT REPLACE OR REDRAW canonical brand assets.');
  process.exit(1);
}

console.log('Brand asset lock OK.');
