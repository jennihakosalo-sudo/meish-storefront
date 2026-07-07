// @ts-check
import { defineConfig } from 'astro/config';

// Static-first (SSG). Every page renders to plain HTML at build time so hosting
// stays free and traffic spikes are effectively free to serve. When the
// reserve-interest flow (MEI-20) needs a serverless endpoint, add the host
// adapter (@astrojs/cloudflare) and switch that single route to `prerender = false`.
export default defineConfig({
  site: 'https://meish.work',
  output: 'static',
  build: {
    format: 'directory',
  },
  trailingSlash: 'ignore',
});
