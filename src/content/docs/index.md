---
title: CAD_0
description: A from-scratch, dual-representation CAD kernel with native SDF and B-Rep.
template: splash
hero:
  title: CAD_0
  tagline: A from-scratch, dual-representation CAD kernel where SDF and B-Rep are first-class peers.
  actions:
    - text: Get Started
      link: /technical/getting-started/
      icon: right-arrow
      variant: primary
    - text: Read the Handbook
      link: /handbook/
      icon: right-arrow
      variant: secondary
    - text: View on GitHub
      link: https://github.com/MarioW98/CAD_zero
      icon: external
      variant: minimal
---

import { Card, CardGrid, LinkCard, LinkButton } from '@astrojs/starlight/components';

:::caution[Project Status]
**CAD_0 is an early-stage, research-grade CAD kernel.** Core geometry, SDF, B-Rep topology, mesh extraction, native project files, Python bindings, and a desktop prototype are available today. Advanced CAD workflows such as a sketcher, full feature history, SDF ↔ B-Rep bridging, and STEP import/export are **planned** roadmap items, not current capabilities.
:::

## What is CAD_0?

Most modern CAD systems rely on opaque, heavyweight third-party geometry kernels. CAD_0 is built from the ground up to be an inspectable, educational, and research-grade foundation for computational geometry.

- **Dual Representation:** Native SDF and native B-Rep coexist. The system does not force one to be a derivative of the other.
- **Deterministic by Construction:** Strict floating-point contracts, bit-identical round-trip tests, and `-ffp-contract=off` ensure geometry evaluates identically across supported toolchains.
- **No Third-Party Kernel:** Every boolean, meshing, and topological validation algorithm is implemented natively in C++20.
- **Transparent Architecture:** An ADR-first (Architecture Decision Record) culture ensures every major design choice is documented and traceable.

## Current Capability Map

| Domain | Capability | Status | Notes |
| :--- | :--- | :---: | :--- |
| **SDF** | Primitives, CSG, Smooth Blends, Transforms | 🟢 Available | Batched vectorized evaluation via `xsimd`. |
| **SDF** | Marching Cubes & Vertex Welding | 🟢 Available | Canonical edge keys, manifold validation. |
| **B-Rep** | Radial-Edge Topology & Query Operators | 🟢 Available | Analytic seam wires for sphere/cylinder. |
| **B-Rep** | Boolean Operations | 🟡 Partial | Currently validated for convex polyhedra (slab decomposition, T-junction subdivision). |
| **Format** | `.CAD_0` v0.2.0 Native Format | 🟢 Available | JSON feature tree + binary blob. Atomic save, transactional load, explicit migration chain. |
| **App** | PySide6 Desktop Prototype | 🟢 Available | Registry-driven Create menu, feature tree, viewport picking, undo/redo. |
| **Bindings**| Python API (`nanobind`) | 🟢 Available | Unstable API. Exposes SDF, meshing, and scene operations. |
| **Bridge** | SDF ↔ B-Rep Conversion | 🔵 Planned | Phase E of the development roadmap. |
| **Modeling**| Sketcher & Feature History | 🔵 Planned | Phase F of the development roadmap. |
| **Interop** | STEP AP203 Import/Export | 🔵 Planned | Phase H of the development roadmap. |

## Choose Your Path

<CardGrid stagger>
  <Card title="🚀 Try it in Codespaces">
    Launch a pre-configured environment with noVNC and Xvfb. No install required.
  </Card>
  <Card title="🛠️ Build locally">
    Follow the Build from Source guide (C++20, CMake, Ninja).
    <LinkButton href="/technical/build-from-source/">Build Guide</LinkButton>
  </Card>
  <Card title="🐍 Use from Python">
    See the Python Quickstart for `nanobind` usage and examples.
    <LinkButton href="/technical/python-quickstart/">Python Quickstart</LinkButton>
  </Card>
  <Card title="📚 Understand the kernel">
    Start with the Implementation Handbook.
    <LinkButton href="/handbook/">Handbook</LinkButton>
  </Card>
</CardGrid>

## Your First Experiment

Verify the kernel in under 5 minutes. This ritual extracts a mesh from a simple SDF primitive.

```bash
git clone https://github.com/MarioW98/CAD_zero.git
cd CAD_zero
pip install cmake ninja nanobind scikit-build-core
cmake -B build -G Ninja -DCMAKE_BUILD_TYPE=Release -DCAD_0_BUILD_PYTHON=ON
cmake --build build
```

## Development Roadmap

- ✅ **Phase A:** Core math, geometry, tolerance model.
- ✅ **Phase B:** SDF kernel, marching cubes, vertex welding.
- ✅ **Phase C:** Viewport architecture, PySide6 desktop app.
- ✅ **Phase C+:** Native format, migrators, import/export, CI matrix.
- ✅ **Phase D:** Radial-edge B-Rep topology, convex booleans, slab decomposition.
- 🔜 **Phase E:** SDF ↔ B-Rep bridge.
- 🔜 **Phase F:** Modeling, feature history, sketcher.
- 🔜 **Phase H:** STEP AP203 MVP.

## Dive Deeper

<CardGrid>
  <LinkCard
    title="Technical Docs"
    description="Operational guides for building, testing, and contributing to the codebase."
    href="/technical/getting-started/"
  />
</CardGrid>
```

Salva il file e aggiorna il browser: dovresti vedere la pagina completamente formattata con le tabelle e le card!

---

### Passo B: Preparazione al Deploy su GitHub Pages
Ora che il sito è perfetto in locale, dobbiamo configurarlo per essere ospitato **gratuitamente su GitHub Pages** (come richiesto dalle istruzioni originali del progetto).

Per farlo, abbiamo bisogno di fare due piccole modifiche ai file di configurazione prima di caricare tutto su GitHub.

**Vuoi che ti fornisca ora:**
1. Le due righe da aggiungere ad `astro.config.mjs` per far funzionare i link su GitHub Pages.
2. Il codice esatto per il file `.github/workflows/deploy.yml` (che dirà a GitHub di costruire e pubblicare il sito in automatico ogni volta che fai un push).
3. I comandi `git` per caricare finalmente tutto il tuo lavoro sulla repository `CAD_zero-site`?

Dimmi **"Sì, procedi col deploy"** e ti guiderò in questi ultimi 3 semplicissimi passaggi per mandare il sito online!