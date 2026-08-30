// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://aryamanagrawal.github.io/silsila',
  base: 'silsila',
  // The /code pages are the house-screen displays, unlisted on purpose:
  // nothing links to them and they should not turn up in search.
  integrations: [sitemap({ filter: (page) => !page.includes('/code') })],
  build: { inlineStylesheets: 'auto' },
});
