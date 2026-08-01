// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://vijo0018.github.io',
  base: '/limnia-site',

  // Astro ignores the PORT env var; read it so dev tooling can assign a
  // free port when 4321 is taken (e.g. parallel worktree sessions).
  server: process.env.PORT ? { port: Number(process.env.PORT) } : {},

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [mdx()],
});
