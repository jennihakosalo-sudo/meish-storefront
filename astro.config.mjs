// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/static';

// Static deploy: no _render serverless function (Vercel no longer accepts nodejs18.x).
// Stripe/API routes live in src/_api_hold/ until adapter upgrade — homepage first.
export default defineConfig({
  site: 'https://www.meish.work',
  output: 'static',
  adapter: vercel(),
  build: {
    format: 'directory',
  },
  trailingSlash: 'ignore',
});
