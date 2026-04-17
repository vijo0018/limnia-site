// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://vijo0018.github.io',
  base: '/omnidraw-site',

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [mdx()],
});
