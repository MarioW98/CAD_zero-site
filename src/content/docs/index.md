---
title: CAD_0
description: A from-scratch, dual-representation CAD kernel with native SDF and B-Rep.
template: splash
hero:
  tagline: A from-scratch, dual-representation CAD kernel.
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
:::danger[BEFORE ANY JUDGEMENT]
***IN PROGRESS:***
The concept for this project was the idea of an guy with a passion for mathematics and engineering. In the current era, I believe that the internet has rendered ignorance a matter of choice rather than a condition.
I'm going to work on this by myself for the time being, so that I can understand this argument on my own.
One of the primary objectives of this project is to facilitate the diffusion of information to a wider audience.
:::

:::caution[Project Status]
**CAD_0 is an early-stage, research-grade CAD kernel.** Core geometry, SDF, B-Rep topology, mesh extraction, SDF→B-Rep bridge, native project files, Python bindings, and a desktop prototype with boolean tree features are available today. Advanced CAD workflows such as a full sketcher and STEP import/export are **planned** roadmap items, not current capabilities.
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
| **SDF** | Marching Cubes & Vertex Welding | 🟢 Available | MC33 extraction with canonical edge keys. |
| **SDF** | Twist Warp Contract | 🟢 Available | Cylinder-AABB bounds, σ(k,r) Lipschitz, chain-rule gradient (ADR-0029). |
| **B-Rep** | Radial-Edge Topology | 🟢 Available | Analytic seam wires. is_closed_orientable contract. |
| **B-Rep** | Boolean Operations | 🟡 Partial | Convex polyhedra (union/subtract/intersect). |
| **Bridge** | SDF → B-Rep Extraction | 🟢 Available | Hard topology contracts, genus-1 support (ADR-0026). |
| **Bridge** | B-Rep → SDF (Inverse) | 🟡 Partial | Approximate documented stub. Full impl. deferred. |
| **Format** | `.CAD_0` v0.3.0 Native Format | 🟢 Available | Recipes = source of truth. Atomic save, migration chain. |
| **App** | PySide6 Desktop Prototype | 🟢 Available | Registry-driven Create menu, feature tree, undo/redo. |
| **App** | Boolean Tree Features | 🟡 Partial | Edit → Subtract as tree node, id-stable undo (ADR-0027). |
| **Bindings**| Python API (`nanobind`) | 🟢 Available | Unstable API. Exposes SDF, meshing, and scene operations. |
| **Modeling**| Sketcher | 🔵 Planned | Next step in Phase F. |
| **Interop** | STEP AP203 Import/Export | 🔵 Planned | Phase H of the development roadmap. |

## Choose Your Path

<CardGrid stagger>
  <Card title="🚀 Try it in Codespaces" icon="puzzle">
    Launch a pre-configured environment with noVNC and Xvfb. No install required.
    [Launch Codespaces →](#)
  </Card>
  <Card title="🛠️ Build locally" icon="seti:makefile">
    Follow the Build from Source guide (C++20, CMake, Ninja).
    [Build from Source →](/technical/build-from-source/)
  </Card>
  <Card title="🐍 Use from Python" icon="seti:python">
    See the Python Quickstart for `nanobind` usage and examples.
    [Python Quickstart →](/technical/python-quickstart/)
  </Card>
  <Card title="🖥️ Use the desktop app" icon="seti:app">
    Read the Desktop App Guide to understand the current UI prototype.
    [Desktop App Guide →](/technical/desktop-app-guide/)
  </Card>
  <Card title="📚 Understand the kernel" icon="open-book">
    A textbook-style treatise on dual-representation geometry.
    [Read the Handbook →](/handbook/)
  </Card>
  <Card title="🤝 Contribute" icon="seti:github">
    Review our Contributing Guidelines and ADR-first culture.
    [Contributing →](/technical/contributing/)
  </Card>
</CardGrid>

## Development Roadmap

- ✅ **Phase A:** Core math, geometry, tolerance model.
- ✅ **Phase B:** SDF kernel, marching cubes, vertex welding, twist warp.
- ✅ **Phase C:** Viewport architecture, PySide6 desktop app.
- ✅ **Phase C+:** Native format, migrators, import/export, CI matrix.
- ✅ **Phase D:** Radial-edge B-Rep topology, convex booleans, slab decomposition.
- ✅ **Phase E:** SDF → B-Rep bridge under hard topology contracts.
- ▶️ **Phase F:** Boolean tree features (in progress). Sketcher next.
- 🔜 **Phase H:** STEP AP203 MVP.

## Your First Experiment

Verify the kernel in under 5 minutes.

```bash
git clone https://github.com/MarioW98/CAD_zero.git
cd CAD_zero
pip install cmake ninja nanobind scikit-build-core
cmake -B build -G Ninja -DCMAKE_BUILD_TYPE=Release -DCAD_0_BUILD_PYTHON=ON
cmake --build build
cd build/python
python3 -c "
import sys; sys.path.insert(0, '.')
import CAD_0
sph = CAD_0.sdf.sphere(radius=2.0)
print(sph.describe())
mesh = CAD_0.sdf.marching_cubes(sph, resolution=16)
print(f'Vertices: {mesh.vertex_count()}, Triangles: {mesh.triangle_count()}')
"
```

## Dive Deeper

<CardGrid>
<LinkCard
title="The Handbook"
description="A textbook-style treatise on dual-representation geometry, robust predicates, and topology validation."
href="/handbook/"
/>
<LinkCard
title="Technical Docs"
description="Operational guides for building, testing, and contributing to the codebase."
href="/technical/"
/>
</CardGrid>
```
