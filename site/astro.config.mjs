// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://aryamanagrawal.github.io/silsila',
  base: 'silsila',
  // The /code and /logo pages are the house-screen displays, unlisted on
  // purpose: nothing links to them and they should not turn up in search.
  integrations: [
    sitemap({ filter: (page) => !/\/(code|logo)/.test(page) }),
  ],
  build: { inlineStylesheets: 'auto' },
});
