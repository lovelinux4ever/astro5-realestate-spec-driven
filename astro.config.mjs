import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';
import netlify from '@astrojs/netlify';

export default defineConfig({
  integrations: [svelte(), tailwind()],
  output: 'server', // Mantenemos SSR como pediste
  adapter: netlify({
    edgeMiddleware: false,
    // Forzamos a que la función use tu versión de Node
    functionNodeVersion: '24.13.0' 
  }),
});