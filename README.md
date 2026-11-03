# CAD_0 — Project Website

The documentation and handbook site for [CAD_0](https://github.com/MarioW98/CAD_zero), a from-scratch, dual-representation CAD kernel (native SDF + B-Rep, C++20 + Python).

Built with [Astro](https://astro.build) + [Starlight](https://starlight.astro.build); diagrams via [astro-mermaid](https://github.com/HiDeoo/astro-mermaid).

## Structure

- `src/content/docs/index.mdx` — landing page with the current capability map and roadmap.
- `src/content/docs/technical/` — operational guides (build, Codespaces, Python, desktop app, testing, contributing, troubleshooting).
- `src/content/docs/handbook/` — the *Implementation Handbook*, a textbook-style treatise written progressively, chapter by chapter.
- `data/capabilities.yml` — the feature-status registry the site's claims reconcile against.
- `data/roadmap.yml` — the phase timeline (committed work vs vision).

## Commands

| Command | Action |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the dev server at `localhost:4321` |
| `npm run build` | Build the production site into `./dist/` |
| `npm run preview` | Preview the production build locally |

## Deployment

The site deploys to GitHub Pages from the `main` branch with base path `/CAD_zero-site` (see `astro.config.mjs`). Keep internal links relative — absolute links without the base path break on the project site.

## Keeping the site honest

Before publishing, reconcile every status claim against the main repository's register ([docs/status/README.md](https://github.com/MarioW98/CAD_zero/blob/main/docs/status/README.md)) — the landing page's capability map, `data/capabilities.yml` and `data/roadmap.yml` must say what the CI testifies, no more and no less.
