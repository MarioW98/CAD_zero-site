---
title: CAD_0
description: A from-scratch, dual-representation CAD kernel with native SDF and B-Rep.
layout: ../layouts/LandingLayout.astro
---

<!-- ================================================== -->
<!-- STATUS BANNER -->
<!-- ================================================== -->
:::caution[Project Status]
**CAD_0 is an early-stage, research-grade CAD kernel.** Core geometry, SDF, B-Rep topology, mesh extraction, native project files, Python bindings, and a desktop prototype are available today. Advanced CAD workflows such as a sketcher, full feature history, SDF ↔ B-Rep bridging, and STEP import/export are **planned** roadmap items, not current capabilities.
:::

<!-- ================================================== -->
<!-- HERO SECTION -->
<!-- ================================================== -->
# CAD_0
### A from-scratch, dual-representation CAD kernel.

CAD_0 is an open-source geometry kernel where Signed Distance Fields (SDF) and Boundary Representation (B-Rep) are first-class peers. There is no primary representation: operations have native implementations in both domains, and the system dispatches on operand types. Built without third-party CAD kernels, every geometric decision lives in the repository and can be tested deterministically.

**Primary Actions:**
- [Get Started](/technical/getting-started)
- [Read the Handbook](/handbook/01-introduction)
- [View on GitHub](https://github.com/MarioW98/CAD_zero)
- [Open in Codespaces](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=YOUR_REPO_ID)

<!-- ================================================== -->
<!-- WHAT IS CAD_0? -->
<!-- ================================================== -->
## What is CAD_0?

Most modern CAD systems rely on opaque, heavyweight third-party geometry kernels. CAD_0 is built from the ground up to be an inspectable, educational, and research-grade foundation for computational geometry.

- **Dual Representation:** Native SDF and native B-Rep coexist. The system does not force one to be a derivative of the other.
- **Deterministic by Construction:** Strict floating-point contracts, bit-identical round-trip tests, and `-ffp-contract=off` ensure geometry evaluates identically across supported toolchains.
- **No Third-Party Kernel:** Every boolean, meshing, and topological validation algorithm is implemented natively in C++20.
- **Transparent Architecture:** An ADR-first (Architecture Decision Record) culture ensures every major design choice is documented and traceable.

<!-- ================================================== -->
<!-- CURRENT CAPABILITY MAP -->
<!-- ================================================== -->
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

<!-- ================================================== -->
<!-- CHOOSE YOUR PATH -->
<!-- ================================================== -->
## Choose Your Path

Identify your goal and select the appropriate starting point:

- 🚀 **I want to try it without installing anything**  
  [Launch GitHub Codespaces](#) for a pre-configured environment with noVNC and Xvfb.
- 🛠️ **I want to build the kernel locally**  
  Follow the [Build from Source](/technical/build-from-source) guide (C++20, CMake, Ninja).
- 🐍 **I want to use it from Python**  
  See the [Python Quickstart](/technical/python-quickstart) for `nanobind` usage and examples.
- 🖥️ **I want to use the desktop app**  
  Read the [Desktop App Guide](/technical/desktop-app-guide) to understand the current UI prototype.
- 📚 **I want to understand how a CAD kernel works**  
  Start with the [Implementation Handbook](/handbook/).
- 🤝 **I want to contribute**  
  Review our [Contributing Guidelines](/technical/contributing) and ADR-first culture.

<!-- ================================================== -->
<!-- FIRST EXPERIMENT -->
<!-- ================================================== -->
## Your First Experiment

Verify the kernel in under 5 minutes. This ritual extracts a mesh from a simple SDF primitive.

1. **Clone and configure:**
   ```bash
   git clone https://github.com/MarioW98/CAD_zero.git
   cd CAD_zero
   pip install cmake ninja nanobind scikit-build-core
   ```
2. **Build with Python bindings:**
   ```bash
   cmake -B build -G Ninja -DCMAKE_BUILD_TYPE=Release -DCAD_0_BUILD_PYTHON=ON -DCAD_0_BUILD_TESTING=ON
   cmake --build build
   ```
3. **Run a smoke test:**
   ```bash
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
   *Expected output:* A description of the sphere and a mesh with ~480 vertices and ~960 triangles.

<!-- ================================================== -->
<!-- ROADMAP SUMMARY -->
<!-- ================================================== -->
## Development Roadmap

- ✅ **Phase A:** Core math, geometry, tolerance model.
- ✅ **Phase B:** SDF kernel, marching cubes, vertex welding.
- ✅ **Phase C:** Viewport architecture, PySide6 desktop app.
- ✅ **Phase C+:** Native format, migrators, import/export, CI matrix.
- ✅ **Phase D:** Radial-edge B-Rep topology, convex booleans, slab decomposition.
- 🔜 **Phase E:** SDF ↔ B-Rep bridge.
- 🔜 **Phase F:** Modeling, feature history, sketcher.
- 🔜 **Phase H:** STEP AP203 MVP.

<!-- ================================================== -->
<!-- FOOTER TEASERS -->
<!-- ================================================== -->
## Dive Deeper

- **The Handbook:** A textbook-style treatise on dual-representation geometry, robust predicates, and topology validation. [Read the Handbook →](/handbook/)
- **Technical Docs:** Operational guides for building, testing, and contributing to the codebase. [View Technical Docs →](/technical/)
```

#### 3. Rationale
*   **Decision-Oriented:** The "Choose Your Path" and "First Experiment" sections immediately answer the visitor's implicit question: *"What do I do next?"* within 30 seconds of landing.
*   **Honest Status Mapping:** The capability map uses the exact status taxonomy (🟢 Available, 🟡 Partial, 🔵 Planned) defined in Step 3, preventing any misinterpretation of the project's maturity.
*   **Copy-Paste Ready:** The bash/Python code block is directly extracted from the `instr1.md` context, ensuring 100% accuracy and reproducibility.

#### 4. Risks / Open Questions
*   **Links:** The GitHub Codespaces link currently has a placeholder `YOUR_REPO_ID`. This will be updated in Step 10 when we finalize the repository setup.
*   **Visuals:** This is pure copy/structure. In Step 10, we will wrap this in Starlight components (e.g., converting the table to a grid of cards if desired, or adding the custom amber accent color to the CTAs).

#### 5. Next Step
If you approve this landing page copy, I will proceed to **Step 5: Capability map and roadmap content**. In that step, I will generate the actual `data/capabilities.yml` and `data/roadmap.yml` files that will programmatically drive the tables and badges on this page, ensuring a single source of truth.

**Please reply with "approve", "revise", or specify any adjustments to the copy.**