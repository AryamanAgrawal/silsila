// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://aryamanagrawal.github.io/silsila',
  base: 'silsila',
  // /code is the house-screen display, unlisted on purpose: nothing links to
  // it and it should not turn up in search.
  integrations: [sitemap({ filter: (page) => !page.endsWith('/code/') })],
  build: { inlineStylesheets: 'auto' },
});
