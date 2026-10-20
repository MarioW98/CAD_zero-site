---
title: Implementation Handbook
description: A textbook-style treatise on dual-representation CAD kernel design and implementation.
---

:::note[Work in Progress]
The handbook is currently under development. The following chapters are planned:

1. **Introduction: What Is a CAD Kernel?** — CAD application vs geometry kernel
2. **Why Dual Representation?** — SDF and B-Rep as first-class peers
3. **Geometric Foundations** — Vectors, transforms, floating-point reality
4. **Robust Predicates** — Numerical honesty and determinism
5. **Signed Distance Fields** — Primitives, CSG, smooth blends, SIMD evaluation
6. **Mesh Extraction** — Marching cubes and vertex welding
7. **Boundary Representation** — Radial-edge topology and query operators
8. **Boolean Operations** — Convex polyhedra booleans with slab decomposition
9. **Scene Graph** — Shape variants and builder registry
10. **Native Format** — `.CAD_0` v0.3.0 with atomic save and migration chains
11. **Python Bindings** — nanobind integration
12. **Desktop App** — PySide6 UI architecture
13. **Testing & CI** — Determinism contracts and golden files
14. **ADR Culture** — Architecture Decision Records
15. **Future Work** — SDF↔B-Rep bridge, sketcher, STEP

Chapters will be added progressively. Stay tuned!
:::