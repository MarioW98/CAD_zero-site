---
title: "Introduction: What Is a CAD Kernel?"
description: The anatomy of a CAD system, the five duties of a geometry kernel, and why CAD_0 rejects the opaque-kernel tradition.
sidebar:
  order: 1
---

:::tip[Learning objectives]
After studying this chapter, you should be able to:

- distinguish a CAD **application** from the **geometry kernel** beneath it, and name the responsibility of each layer of the system;
- describe the five canonical duties of a geometry kernel — representation, evaluation, modification, interrogation and exchange — and give an example of each;
- explain why commercial kernels are historically opaque, and why opacity is at odds with deterministic, testable geometry;
- state the dual-representation hypothesis on which CAD_0 is founded, and locate the project's modules on the map that will be used throughout the book.
:::

**Abstract.** This chapter builds the conceptual vocabulary used by the rest of the handbook. It begins with the anatomy of a computer-aided design system and isolates the geometry kernel as a distinct, contract-bound component. It then characterises the kernel through five canonical duties, illustrates each with examples drawn from real systems, and situates CAD_0 against the historical tradition of opaque commercial kernels. The chapter closes by stating the dual-representation hypothesis — signed distance fields and boundary representation as first-class peers — and by mapping the repository's modules onto the concepts introduced here. No prior experience with geometric modelling is assumed; comfort with vectors and general programming maturity suffices.

## 1.1 Geometry as an engineered artefact

Nearly every physical object that surrounds you — the chair you are sitting on, the aircraft that carried you to your last holiday, the implant that repaired someone's hip — was, at some point in its life, a description inside a CAD system. Not a drawing of the object, and not a picture of it, but a *model*: a structured body of data from which questions about the object can be answered by computation. Is this hole deep enough for the screw? Does this pipe collide with that beam? What is the volume of this cavity, and will the molten polymer fill it? The software that answers such questions does so by manipulating an explicit representation of geometry, and the quality of those answers is bounded by the quality of that representation.

There is a curious asymmetry, however, in how this software is perceived. Most engineers learn to *use* a CAD application — to sketch, extrude, fillet and assemble — without ever being shown the machinery underneath. The machinery has a name: the **geometry kernel**. It is the component that actually knows what a cylinder is, that decides whether two solids intersect, that produces the exact boundary of the material removed by a drilled hole. The kernel is where the mathematics lives, and for most of the industry's history it has lived behind closed doors, licensed as a binary library whose internal decisions cannot be inspected, questioned or audited by its users.

This handbook exists because that asymmetry is no longer justified. CAD_0 is a geometry kernel built from scratch, in the open, with every geometric decision recorded in an Architecture Decision Record and every numerical behaviour pinned by deterministic tests. The premise of the book is that the most reliable way to understand what a CAD kernel *is* is to follow the construction of one — not in the abstract, but concretely, in the order in which the real system was really built, with the real constraints that shaped each choice. By the end of the book you will not merely know *that* a kernel performs boolean operations; you will know what data structures make them possible, what floating-point hazards they must survive, and what contracts certify their results.

A word of expectation-setting before we begin. CAD_0 is an early-stage, research-grade system: its sketcher and STEP support are planned rather than available, and its boolean operations on the B-Rep side are currently limited to convex polyhedra. The handbook treats these limits honestly rather than hiding them, because the limits themselves are instructive — they mark the exact points where geometric modelling becomes hard, and a textbook that pretends otherwise would be teaching you less, not more.

## 1.2 The anatomy of a CAD system

A complete CAD system is best understood as three layers, each with a distinct responsibility and a strictly bounded relationship with its neighbours. At the top sits the **application layer**: menus, dialogs, the feature tree, the property panel, undo and redo — everything the user perceives. Its currency is *intent*: the user's wish to create a cylinder, to subtract one body from another, to change a radius. At the bottom sits the **foundation layer**: linear algebra, tolerances, memory management, threading — the numerical substrate without which neither of the upper layers can function reliably. Between them sits the subject of this book, the **geometry kernel**: the component that receives intent expressed in a formal language ("create a sphere of radius 2.0 at the origin", "subtract body B from body A") and answers with geometry — shapes, intersections, boundaries, validity.

Sandwiched between the application and the kernel — or, depending on one's viewpoint, wrapped around the kernel — there is usually a fourth element that deserves its own mention: the **document**, the in-memory model that records what the user has built so far. In parametric systems the document is not merely a pile of shapes; it is a *recipe* — a feature tree whose nodes record operations and whose parameters can be edited, causing the tree to be re-evaluated. The document has a persistent form (the file format) and a live form (the scene graph), and the boundary between the document and the kernel is one of the most fruitful places to look when trying to understand how a CAD system really works.

The layers communicate through a narrow, disciplined cycle. The application never performs geometry itself, and the kernel never touches the user interface. Listing 1-1 shows the canonical interaction in pseudocode; it is worth memorising, because every subsystem we shall meet in this book — the builder registry, the transactional format, the undo stack — exists to keep this cycle honest.

```text
Listing 1-1. The command cycle of a CAD application.

on user command (menu item, property edit, import, ...):
    validate the command against the current document state
    result ← kernel.perform(operation, operands, parameters)
    commit result to the document          # new nodes, new ids, updated tree
    mark the document dirty                # there are unsaved changes
    schedule a redraw of the affected views
```

Two properties of this cycle matter more than any other. First, the kernel call is *pure* with respect to the user interface: given the same operation and the same inputs, the kernel must produce the same geometric result regardless of which button was clicked, in which order, on which platform. Second, the document commit is *transactional*: a failed operation must leave the document exactly as it was, never half-updated. Everything else — widgets, themes, keyboard shortcuts — is decoration around these two invariants.

:::note[In CAD_0 — the module map]
CAD_0's repository is organised precisely along the layers described above. `core/` is the C++20 kernel and is deliberately free of any user-interface dependency: `core/math/` (vectors, matrices, quaternions, bounding boxes, tolerances, robust predicates) is the foundation layer; `core/geometry/`, `core/sdf/`, `core/brep/` and `core/bridge/` are the geometric heart; `core/concurrency/` provides the thread pool and the Python GIL guard; `core/scene/` holds the scene graph and the builder registry; `core/viewport/` provides headless-first rendering; and `core/io/` implements STL/OBJ/3MF exchange and the versioned native `.CAD_0` format. Above the kernel sit `bindings/python/` (nanobind bindings) and `app/` (the PySide6 desktop application). The mapping layer → directory is maintained deliberately, and ADR-0006 records the decision that PySide6, not a C++/Qt stack, is the primary UI.
:::

## 1.3 What is a geometry kernel?

We can now attempt a definition, which the rest of the chapter will unpack. A **geometry kernel** is a software library that *represents* shapes as data, *evaluates* geometric properties of those shapes, *modifies* them to produce new shapes, *interrogates* their internal structure, and *exchanges* them with other systems — all while enforcing the validity conditions that make the answers trustworthy. The definition is deliberately phrased as five duties, because each duty raises distinct design questions, and the history of CAD is in large part the history of choosing — well or badly — how to fulfil each of them.

**Representation** is the founding duty: the kernel must answer the question "what is the data that says this is a sphere, this is a bracket, this is a gear blank?". The question is deeper than it sounds, because no single data structure serves all purposes equally well. A *parametric recipe* ("sphere, centre *c*, radius *r*") is compact and exact, but answers queries slowly; a *triangle mesh* answers rendering queries quickly, but represents curved surfaces only approximately and carries no notion of solidity; an *implicit field* answers inside/outside questions elegantly, but says nothing about faces or edges; a *boundary representation* (B-Rep) describes a solid through its faces, edges and vertices with full topological rigour, at the price of considerable complexity. A kernel's most consequential early decision is which representation or representations to make native — and, as we shall see in Chapter 2, CAD_0's defining choice is to refuse the question's premise and make two representations native at once.

**Evaluation** is the duty of computing geometric answers: the distance from a point to a shape, the classification of a point as inside or outside, the intersection curve between two surfaces, the inertia properties of a solid. Evaluation is where numerical analysis meets geometry, and it is the duty in which floating-point reality bites hardest. When a point lies a tenth of a nanometre from a plane, the predicate "is the point above the plane?" must still return *something*, and the kernel's designers must decide — in advance, not ad hoc — what that something will be. **Modification** is the duty of producing new shapes from old: boolean unions, subtractions and intersections; fillets and chamfers; transforms. Modification is the most algorithmically demanding duty — booleans in particular are notorious — and it is the duty whose failures are most visible, since a corrupted solid is useless downstream. **Interrogation** is the duty of exposing structure: given an edge, which faces meet there? Given a vertex, how many edges touch it? Is this shell closed and orientable? These queries sound modest, but they are the load-bearing beams of every higher-level operation, and Chapter 11 will treat them with the care they deserve. Finally, **exchange** is the duty of crossing system boundaries: writing a mesh to STL, exporting a document to 3MF, one day importing STEP. Exchange is the duty in which the kernel meets the outside world as it actually is — full of formats with quirks, units in dispute, and geometry that was perfectly valid until the other system's tolerance policy got involved.

Listing 1-2 gathers the five duties into a single abstract interface. The listing is pseudocode — deliberately language-neutral, a convention the whole handbook follows — but every function in it has a concrete counterpart in CAD_0, as the box beneath it records.

```text
Listing 1-2. The five duties of a kernel, as an abstract interface.

interface GeometryKernel:

    # — representation — build and store shapes
    make_sphere(centre, radius)              → ShapeRef
    make_cylinder(centre, axis, r, height)   → ShapeRef

    # — evaluation — compute geometric answers
    evaluate_distance(shape, point)          → real
    classify_point(shape, point)             → {inside, outside, on}

    # — modification — produce new shapes from old
    boolean_union(a, b)                      → ShapeRef
    boolean_subtract(a, b)                   → ShapeRef
    smooth_blend(a, b, k)                    → ShapeRef

    # — interrogation — ask about structure
    faces_around_edge(edge)                  → set of Face
    is_closed_orientable(solid)              → boolean

    # — exchange — cross system boundaries
    export(shape, format)                    → byte stream
    import(byte_stream, format)              → ShapeRef
```

:::note[In CAD_0 — the same five verbs, in the project's own words]
The Python bindings expose one real API per duty, which makes the mapping from theory to code unusually direct. *Representation*: `CAD_0.sdf.sphere(radius=2.0)` builds a native signed-distance sphere — not a mesh, not a recipe that will be expanded later. *Evaluation*: `CAD_0.sdf.evaluate(shape, points)` evaluates the field on batches of points, vectorised and multi-threaded. *Modification*: `CAD_0.sdf.subtract(a, b)` and `CAD_0.sdf.smooth_union(a, b, k)` operate natively in the SDF domain, and `bool_union` / `bool_subtract` / `bool_intersect` operate on B-Rep solids. *Interrogation*: the topology query operators of ADR-0022 — `faces_around_edge`, `edges_around_vertex`, `opposite_coedge`, `wireframe_edges`, `vertex_valence` — together with validity reports (closed-orientable, Euler characteristic, genus) surfaced in the app's Debug menu. *Exchange*: `CAD_0.io.export('output.stl', mesh)` with format auto-detected from the extension, STL/OBJ/3MF export, and the native `.CAD_0` document format via `CAD_0.io.save` / `CAD_0.io.load`.
:::

## 1.4 A brief history of geometry kernels, and the problem of opacity

The geometry kernel as a product category was born in Britain in the late 1970s. Ian Braid's doctoral work on building blocks for solid modelling led to ROMULUS, developed at Shape Data in Cambridge, and ROMULUS in turn gave rise to two lineages that still dominate the field. One became **Parasolid**, which passed through EDS and now belongs to Siemens; it is the kernel inside NX, Solid Edge, and many other commercial systems, and its modelling data structure — descendant of the Shape Data design — has been the industry's reference for decades. The other became **ACIS**, developed in the early 1990s at Spatial Technology by alumni of the same Cambridge group; ACIS powered, among many others, AutoCAD and Inventor through the years. The third significant actor arrived by a different route: **OpenCascade**, which emerged from Matra Datavision in France and was released as open source at the turn of the millennium. OpenCascade matters to this book in two ways: it is the only kernel of the three that can be studied freely, and it demonstrates both the power and the cautionary tale of open kernels — enormous capability, accumulated over decades, with the architectural opacity that decades of accretion inevitably produce.

Three properties of this history deserve attention, because they explain why CAD_0 exists. First, the kernels are *enormous*: Parasolid and ACIS are counted in millions of lines of code built over thirty-plus years, which means no individual — and few organisations — can hold their behaviour in mind. Second, they are *opaque by licence and by construction*: the commercial ones ship as binaries with assertions hidden in debug builds and geometric decisions taken inside; even OpenCascade, though source-visible, presents a surface so wide that tracing one decision (why did this fillet fail?) can take days. Third, they are *economically load-bearing*: entire industries license them, so their design frozen in the 1980s constrains what modern systems can express. The consequence for anyone wanting to *understand* kernels is stark: the reference implementations cannot be opened, and the textbooks stop exactly where the interesting engineering begins.

CAD_0 takes the opposite wager, and it writes the wager down. ADR-0003 commits the project to a **no-third-party-kernel policy**: no Parasolid, no ACIS, no OpenCascade — every boolean, every meshing step, every topological validation is implemented natively in C++20 and lives in the repository. The wager buys three things. It buys *auditability*: when an intersection behaves unexpectedly, the answer is in the source, not in a support ticket. It buys *determinism as a design goal*: cross-platform bit-identical evaluation is achievable only when the whole numerical pipeline is owned, and ADR-0014 turns that ambition into compile flags, round-trip tests and golden files. And it buys *education*: a kernel small enough to be read end-to-end by one person — which is, precisely, the point of this handbook.

:::caution[In CAD_0 — the cost of the wager is paid, not waved away]
Refusing third-party kernels does not make the geometry problems disappear; it makes them *visible*. The project pays for the policy with effort: robust predicates are vendored (Shewchuk's, public domain, under `third_party/`), the licence of every dependency is audited (ADR-0013 forbids GPL modules such as CGAL's), and each subsystem's limitations are stated rather than excused — B-Rep booleans currently assume convex polyhedra, and the inverse bridge (B-Rep → SDF) is a documented stub. ADR-0003, ADR-0013 and ADR-0014 together form the constitutional documents of this policy, and Chapter 19 returns to the ADR practice that keeps it accountable.
:::

## 1.5 The contract between application and kernel

The boundary between the application layer and the kernel is not merely an interface; it is a *contract*, and it is worth stating the contract's clauses explicitly, because they recur throughout the book in different costumes. **Clause one: geometry lives only in the kernel.** The application must never embed geometric reasoning — no distance computations in the UI thread, no ad hoc point-in-solid tests in the feature tree — because duplicated geometric logic is the first step towards answers that disagree with each other. **Clause two: one source of truth per fact.** If the set of creatable shapes is defined in the kernel's builder registry, the application's Create menu must be *derived* from that registry, not re-declared beside it; otherwise the two will drift, and users will be offered shapes the kernel cannot honour. **Clause three: results are committed transactionally.** An operation either fully succeeds and updates the document, or fully fails and leaves the document untouched; partial commits are forbidden. **Clause four: the contract includes determinism.** Identical operations on identical inputs must yield identical results — bit-identical, not merely visually similar — across machines and toolchains, because a geometry platform whose output varies between builds cannot support round-trip guarantees, regression tests or reproducible research.

The fourth clause is the one CAD_0 takes most seriously, and its implementation is worth previewing here even though Chapter 18 is devoted to it. Floating-point arithmetic on modern compilers is *not* automatically reproducible: re-association, fused multiply-add contraction and instruction reordering can change the last bits of a result, and in geometry the last bits can decide whether a point is inside or outside a solid — that is, whether a boolean operation succeeds or corrupts a model. CAD_0 therefore compiles the core with `-ffp-contract=off`, writes round-trip tests that must compare *bit-identical* results, and maintains golden files that must match *byte-identical* across the CI matrix (GCC 11 debug and release, Clang 14). Determinism, in this project, is a contract enforced by machinery, not a hope expressed in comments.

:::note[In CAD_0 — one registry, two consumers]
The cleanest illustration of the contract is the **builder registry** in `core/scene/builders.hpp`. The kernel defines, in one place, the set of parametric builders (sphere, box, cylinder, and so on) together with their parameter schemas. The PySide6 application's **Create** menu is populated by iterating that registry: adding a builder in C++ makes it appear in the UI automatically, with its parameters editable in the property panel — no UI-side re-declaration, no drift. The same discipline governs the document: edits flow through commands that call kernel operations and commit to the feature tree with id-stable undo/redo, so that clause three (transactionality) holds not only for geometry but for the user's history as well.
:::

## 1.6 What a kernel is not

Definitions by inclusion are sharpened by definitions by exclusion, and four exclusions in particular are worth making explicit, because each marks a boundary that well-meaning designs have blurred. A kernel is **not a renderer**. Producing images of shapes is presentation, not geometry: it may approximate (tessellating a curved surface into triangles), it may cache, it may drop precision freely, and it must never feed approximations back into the model. CAD_0 keeps its viewport subsystem (`core/viewport/`) architecturally separate and *headless-first* (ADR-0017): the entire UI suite runs offscreen under Xvfb in CI, which is possible precisely because rendering is a consumer of geometry, never a source of it. A kernel is **not a file format**. Persistence has its own concerns — versioning, migration, atomicity — and CAD_0 accordingly gives the native `.CAD_0` format its own subsystem (`core/io/`) with its own ADRs (0007, 0007a) and its own guarantee: an atomic save that a crash can never corrupt, and a transactional load that validates the whole document before the scene is touched.

A kernel is **not a constraint solver**. The sketcher — the interactive, constraint-driven 2D editor that seeds most parametric models — is a discipline of its own, mixing symbolic reasoning, numerical solving and UX in ways quite distinct from kernel geometry; CAD_0 defers it explicitly (ADR-0030 drafts the sketcher MVP with the constraint solver postponed and an entry criterion written down), and the handbook defers it with the project, to Chapter 20. Finally, a kernel is **not a scene graph**. The scene graph answers "what objects exist, where, with what visibility" — orchestration, not geometry. CAD_0's `core/scene/` is deliberately thin: SceneNode variants and a builder registry, no implicit hierarchy of geometric semantics, so that the kernel's core remains free of presentation-era concepts. These four exclusions are not pedantry; they are the reason the kernel can be tested headlessly, bounded by contracts, and read by one person.

## 1.7 The dual-representation hypothesis

We close with the idea that gives CAD_0 its identity, which the next chapter develops in full. The traditional answer to the representation question of §1.3 is monogamous: a kernel picks one native representation — for mainstream B-Rep systems, the boundary representation — and everything else is a guest: meshes are approximations for display, implicit fields are an exotic corner, and conversions point one way. The hypothesis CAD_0 tests is different: **signed distance fields and boundary representation can coexist as first-class peers, neither derived from the other, with every operation provided natively in both domains and the system dispatching on operand types.** In the SDF domain, primitives are fields, booleans are min/max algebra, smooth blends are smooth-min compositions, and nothing needs a mesh until extraction is explicitly requested. In the B-Rep domain, solids are topological structures — radial-edge entities with faces, edges and vertices — supporting queries and booleans of their own. Between the two domains stands the bridge: a disciplined converter (SDF → B-Rep) operating under hard topology contracts, with pinned vertex-edge-face counts per grid and genus-1 extractions verified bit-identically.

The price of the hypothesis is honesty about duplication: two native representations mean two implementations to build, test and keep contractually consistent, and Chapter 2 will not pretend otherwise. The reward is that each domain does what it does best — the SDF world excels at composition, blending and cheap inside/outside answers; the B-Rep world excels at exact faces, topology queries and industry-standard exchange — without forcing either to impersonate the other. The reward is also pedagogical, and it is why the handbook is shaped as it is: Parts II and III of this book are the two worlds studied in turn, Part IV is the product that unites them, and the reader who completes the journey will have seen, concretely, what "first-class peers" costs, what it buys, and where it remains genuinely hard.

:::note[In CAD_0 — the hypothesis in one data structure]
ADR-0002 records the decision in miniature: a `Shape` is a `std::variant` over the native representations — SDF nodes and, since Phase D, B-Rep entities — and `core/scene/` stores `SceneNode`s that may be SDF bodies or meshes, with operations dispatching on the actual operand kinds. The capability map on the project's landing page is the hypothesis made visible: green rows for native SDF capabilities, green rows for native B-Rep capabilities, and a 🟡 row for the inverse bridge, deferred with a documented stub rather than silently pretended.
:::

## 1.8 How to read this handbook

The handbook's structure follows the kernel's construction, and a few minutes spent on the map will repay themselves throughout. Part I (Chapters 1–4) lays the foundations: the anatomy of the system, the dual-representation hypothesis, the mathematical toolkit and the robust predicates that make geometry numerically survivable. Part II (Chapters 5–9) studies the implicit world — primitives and CSG, blends and warps, batched SIMD evaluation, and the extraction of meshes via Marching Cubes 33 with deterministic vertex welding. Part III (Chapters 10–13) studies the explicit world — radial-edge topology, query operators and seam wires, booleans on convex polyhedra, and the SDF → B-Rep bridge under its hard contracts. Part IV (Chapters 14–19) builds the product around the kernel — scene graph, native format, Python bindings, desktop application, testing and determinism, and the ADR culture that documents every major decision. Part V (Chapter 20) looks forward: the sketcher, STEP AP203, and the inverse bridge.

Two reading paths are supported. The **sequential reader** — a student, or an engineer new to geometric modelling — should read forward from here; the book assumes comfort with vectors and elementary calculus, and develops the rest as needed, with each chapter's pseudocode independent of any programming language. The **builder reader** — someone who wants to use, extend or audit CAD_0 now — may begin at Part IV for the product-level view and descend into Parts II and III whenever the kernel's interior matters. Whichever path you take, keep one habit from this chapter: when the text states a contract, read it as a contract — something the implementation is bound by, the tests certify, and you are now invited to check.

## Summary

- A CAD system is three layers with strictly bounded duties: an **application layer** (intent, feature tree, commands), a **geometry kernel** (representation, evaluation, modification, interrogation, exchange), and a **foundation layer** (linear algebra, tolerances, threading); the **document** — live scene and persisted file — sits between application and kernel.
- The kernel's five duties — represent, evaluate, modify, interrogate, exchange — each raise distinct design questions, and no single representation serves them all; kernels are defined as much by what they exclude (renderer, file format, constraint solver, scene graph) as by what they include.
- The application–kernel relationship is a contract: geometry lives only in the kernel; there is one source of truth per fact (the builder registry); commits are transactional; and results are **deterministic** — bit-identical across toolchains, enforced by `-ffp-contract=off`, round-trip tests and golden files.
- The historical kernels (Parasolid, ACIS, OpenCascade) are powerful but opaque; CAD_0's founding wager (ADR-0003) is to build without them, buying auditability, determinism and education at the documented price of implementing the geometry natively.
- CAD_0's defining hypothesis is **dual representation**: SDF and B-Rep as first-class peers (ADR-0002), with a contract-bound bridge between them (ADR-0026); the handbook's Parts II–IV study the two worlds, the bridge and the product that unites them, in the order the kernel itself was built.

## Further reading

- **Requicha, A. A. G. (1980). "Representations for Rigid Solids: Theory, Methods, and Systems." *ACM Computing Surveys* 12(4).** The founding taxonomy of solid representations; the framework behind the "representation" duty of §1.3, and still the clearest statement of what makes a representation *adequate* for a class of queries.
- **Hoffmann, C. M. (1989). *Geometric and Solid Modeling: An Introduction*. Morgan Kaufmann.** The standard mathematical introduction to CSG and B-Rep, written by one of the field's principal contributors; chapters on boolean operations foreshadow the difficulties met again in Part III.
- **Mortenson, M. E. (1997). *Geometric Modeling*, 2nd ed. Wiley.** A broad, unhurried survey of the modelling toolkit — curves, surfaces, solids — useful as a companion throughout Parts II and III.
- **Farin, G. (2001). *Curves and Surfaces for CAGD*, 5th ed. Morgan Kaufmann.** The reference for the differential-geometric background (tangents, normals, curvature) that Part II uses when discussing blends and field properties.
- **The CAD_0 architecture record: `docs/architecture/overview.md` and the ADR index in `docs/adr/`.** The project's own account of its structure and decisions; reading ADR-0002, ADR-0003 and ADR-0014 immediately after this chapter is the recommended bridge from theory to the repository.
