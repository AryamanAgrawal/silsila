// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://aryamanagrawal.github.io/silsila',
  base: 'silsila',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
});
