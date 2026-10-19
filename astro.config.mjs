import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';

export default defineConfig({
  site: 'https://mariow98.github.io',
  base: '/CAD_zero-site', // Fondamentale per GitHub Pages
  integrations: [
    mermaid(),
    starlight({
      title: 'CAD_0',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/MarioW98/CAD_zero' }
      ],
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