import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'CAD_0',
      // La sintassi 'social' ora richiede un array di oggetti
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/MarioW98/CAD_zero' }
      ],
      // La sintassi 'autogenerate' ora deve essere annidata dentro un array 'items'
      sidebar: [
        { label: 'Home', link: '/' },
        { 
          label: 'Technical Docs', 
          items: [{ autogenerate: { directory: 'technical' } }] 
        },
        { 
          label: 'Handbook', 
          items: [{ autogenerate: { directory: 'handbook' } }] 
        }
      ],
    }),
  ],
});