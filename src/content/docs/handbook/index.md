---
title: Implementation Handbook
description: A textbook-style treatise on dual-representation CAD kernel design and implementation.
sidebar:
  order: 0
---

# Implementation Handbook

This handbook is the didactic companion to **CAD_0**, a from-scratch, dual-representation CAD kernel written in C++20 and exposed to Python through nanobind. It is not a user manual for the desktop application, and it is not a substitute for the [technical documentation](../technical/getting-started/). It is something different: a textbook that explains *why* a geometry kernel is built the way CAD_0 is built, *how* each component works, and *what* contracts hold the whole system together.

The method of the book is deliberately unusual. Rather than presenting geometry kernels as finished artefacts to be admired from the outside, the handbook follows the actual construction of a real kernel in the order in which it was really built: mathematical foundations first, then the implicit world of signed distance fields, then the explicit world of boundary representation, then the product layers that turn a kernel into a usable system. Wherever the text discusses a concept, an **In CAD_0** box maps it to the concrete module, data structure or Architecture Decision Record (ADR) that implements it, so that theory and code can always be cross-checked against one another.

:::note[Work in Progress]
The handbook is written progressively, chapter by chapter. Chapters marked ✍️ are drafted and available; chapters marked ⏳ are planned and will appear in subsequent revisions. The chapter list below is the authoritative plan for the whole book.
:::

## How the book is organised

The twenty chapters are grouped into five parts. Each part corresponds to a coherent layer of the kernel and, broadly, to a phase of CAD_0's development roadmap.

### Part I — Foundations

Why kernels exist, why CAD_0 has two representations instead of one, and the numerical ground rules that make deterministic geometry possible.

| Ch. | Chapter | Status |
| --- | --- | --- |
| 1 | [Introduction: What Is a CAD Kernel?](foundations/introduction/) — the anatomy of a CAD system, the five duties of a kernel, and why CAD_0 rejects the opaque-kernel tradition | ✍️ |
| 2 | [Why Dual Representation?](foundations/why-dual-representation/) — SDF and B-Rep as first-class peers, dispatch on operand types, the price and the reward | ✍️ |
| 3 | Geometric Foundations — vectors, transforms, bounding boxes, and the floating-point reality of computation | ⏳ |
| 4 | Robust Predicates — tolerances, orientation and incircle tests, and numerical honesty | ⏳ |

### Part II — The Implicit World

The signed-distance half of the kernel: shapes as fields, operations as algebra, meshes only when asked for.

| Ch. | Chapter | Status |
| --- | --- | --- |
| 5 | Signed Distance Fields I: Primitives and CSG — sphere, box, cylinder, and boolean operations as min/max algebra | ⏳ |
| 6 | Signed Distance Fields II: Smooth Blends and Warps — smooth minimum, Lipschitz contracts, the twist warp (ADR-0029) | ⏳ |
| 7 | Signed Distance Fields III: Batched Evaluation — SIMD evaluation with xsimd, threading, and the evaluation backend | ⏳ |
| 8 | Mesh Extraction I: Marching Cubes 33 — from field to triangle soup, canonical edge keys (ADR-0015) | ⏳ |
| 9 | Mesh Extraction II: Vertex Welding — welding duplicated vertices deterministically (ADR-0016) | ⏳ |

### Part III — The Explicit World

The boundary-representation half of the kernel: topology as a data structure, booleans on convex polyhedra, and the bridge that joins the two worlds.

| Ch. | Chapter | Status |
| --- | --- | --- |
| 10 | Boundary Representation I: Radial-Edge Topology — the radial-edge entity set, IDs and Euler invariants (ADR-0021) | ⏳ |
| 11 | Boundary Representation II: Query Operators and Seam Wires — faces_around_edge, opposite_coedge, analytic seams (ADR-0022, ADR-0023) | ⏳ |
| 12 | Boolean Operations on Convex Polyhedra — slab decomposition, centroid classification, validity contracts (ADR-0024, ADR-0025) | ⏳ |
| 13 | The Bridge: SDF → B-Rep — extraction under hard topology contracts, pinned V/E/F counts, genus-1 bodies (ADR-0026) | ⏳ |

### Part IV — Building the Product

Everything that turns a kernel into a system: scene management, persistence, language bindings, the desktop application, and the engineering culture that keeps it honest.

| Ch. | Chapter | Status |
| --- | --- | --- |
| 14 | The Scene Graph — SceneNode, shape variants, and the builder registry as single source of truth | ⏳ |
| 15 | The Native Format `.CAD_0` — versioned documents, recipes as source of truth, atomic save and migration chains (ADR-0007) | ⏳ |
| 16 | Python Bindings with nanobind — exposing C++20 to Python, the GIL, and why not pybind11 (ADR-0011) | ⏳ |
| 17 | The Desktop Application — PySide6 UI architecture, feature tree, undo/redo, picking (ADR-0006) | ⏳ |
| 18 | Testing, Determinism and CI — bit-identical round-trips, byte-identical golden files, headless UI tests | ⏳ |
| 19 | ADR Culture — writing decisions before code, and why the record is part of the product | ⏳ |

### Part V — Horizons

Where the kernel goes next: the sketcher, STEP exchange, and the open problems of the inverse bridge.

| Ch. | Chapter | Status |
| --- | --- | --- |
| 20 | Future Work: Sketcher, STEP and the Inverse Bridge — the sketcher MVP (ADR-0030), STEP AP203 scope, and why B-Rep → SDF is genuinely hard | ⏳ |

## How to read this handbook

There are two intended paths through the material. The **sequential reader** — a student, or an engineer new to geometric modelling — should start at Chapter 1 and read forward: the book assumes only comfort with vectors, elementary calculus and general programming maturity, and it develops everything else on the way. The **builder reader** — someone who wants to use, extend or audit CAD_0 right now — may start at Part IV for the product-level view (scene, format, bindings, app) and drop back into Parts II and III whenever the kernel's interior matters. Both paths converge on the same advice: read every **In CAD_0** box, because it anchors each abstraction to a file, a data structure or an ADR that you can open and check.

Three conventions recur in every chapter. Each chapter opens with **learning objectives** and an **abstract**, and closes with a **summary** and a short annotated list of further reading. Code appears as **language-neutral pseudocode** rather than C++ or Python, so that algorithms remain readable independently of CAD_0's syntax; the accompanying box always names the real module or API that implements the idea. Finally, whenever a property is guaranteed by construction — determinism, topology contracts, tolerance policy — the text states it as an explicit contract, because in this project guarantees are written down, tested and never left implicit.
