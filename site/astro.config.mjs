// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://aryamanagrawal.github.io/silsila',
  base: 'silsila',
  // /code, /logo and /header are display and print artefacts, unlisted on
  // purpose: nothing links to them and they should not turn up in search.
  integrations: [
    sitemap({ filter: (page) => !/\/(code|logo|header)/.test(page) }),
  ],
  build: { inlineStylesheets: 'auto' },
});
