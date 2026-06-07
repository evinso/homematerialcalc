import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://homematerialcalc.com',
  integrations: [
    mdx(),
    react(),
    tailwind(),
  ],
  output: 'hybrid',
  adapter: vercel(),
});
