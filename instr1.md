You are acting as a senior technical writer, information architect, product designer, and static-site engineer for the open-source project CAD_0.

Your job is to help me design and build a public website for CAD_0, step by step. Do not generate the entire site in one response. Work incrementally, ask for approval when requested, and produce concrete files, copy, structure, and commands at each step.

==================================================
1. PROJECT CONTEXT
==================================================

Repository:
https://github.com/MarioW98/CAD_zero

CAD_0 is a from-scratch CAD kernel where SDF, signed distance fields, and B-Rep, boundary representation, are first-class peers. There is no primary representation: operations have native implementations in both domains, and the system dispatches on operand types.

The long-term goal is an open-source CAD system built without any third-party CAD kernel, so every geometric decision lives in the repository and can be tested deterministically.

Important current facts from the repository README:

- Core language: C++20 kernel, zero UI dependencies in the core.
- Python bindings: nanobind.
- Desktop app: PySide6.
- Native format: `.CAD_0`, version v0.2.0.
- Format structure: JSON feature tree plus binary blob container for embedded meshes.
- Save behavior: atomic save.
- Load behavior: transactional load.
- Migration chain: explicit, including v0.1.0 to v0.2.0.
- Import: STL/OBJ with vertex welding.
- Export: STL/OBJ/3MF.
- SDF side currently includes:
  - native SDF primitives
  - CSG booleans
  - smooth blends
  - transforms
  - batched vectorized evaluation using xsimd
  - multi-threaded evaluation
  - marching cubes mesh extraction
  - vertex welding via canonical edge keys
- B-Rep side currently includes:
  - radial-edge topology
  - query operators
  - analytic seam wires for sphere and cylinder
  - boolean operations on convex polyhedra:
    - `bool_union`
    - `bool_subtract`
    - `bool_intersect`
  - Sutherland-Hodgman clipping
  - slab decomposition for non-convex face fragments
  - `IntersectionTable`
  - `SharedVertexPool`
  - T-junction subdivision
  - topological validation:
    - V/E/F counts
    - Euler characteristic χ=2
    - closed loops
    - `is_closed_manifold`
- Desktop app currently includes:
  - registry-driven Create menu
  - feature tree
  - parametric property panel
  - undo/redo
  - viewport picking
  - amber 3D highlight
  - import/export
  - Open/Save/Save As
  - dirty tracking
- Testing and CI:
  - CI matrix on ubuntu-22.04
  - GCC 11 debug with ASan
  - GCC 11 release
  - Clang 14
  - C++ doctest suite
  - Python bindings tests
  - headless UI tests under Xvfb
  - fail-fast off
- Determinism:
  - `-ffp-contract=off`
  - bit-identical round-trip tests
  - byte-identical golden files
  - fixes must not silently change evaluation values
- Architecture culture:
  - ADR-first
  - architectural decisions recorded in `docs/adr/`
  - regressions get a failing test before the fix
- Codespaces:
  - `bash scripts/start_codespaces.sh`
  - builds kernel and Python package
  - starts Xvfb + fluxbox
  - exposes noVNC on port 6080
  - launches the app
  - uses the same software-GL stack as CI UI tests

Roadmap status:

- Phase A: Core math, geometry, tolerance model — done.
- Phase B: SDF kernel, marching cubes, vertex welding — done.
- Phase C: Viewport architecture, PySide6 desktop app — done.
- Phase C+: Native format, migrators, STL/OBJ import, picking, CI matrix, toolchain contract — done.
- Phase D: Radial-edge B-Rep topology, query operators, seam wires, convex booleans with slab decomposition and T-junction subdivision — done.
- Phase E: SDF ↔ B-Rep bridge — planned.
- Phase F: Modeling, feature history, sketcher — planned.
- Phase H: STEP AP203 MVP — planned.

Key build commands:

Kernel and tests without Python:

```bash
git clone https://github.com/MarioW98/CAD_zero.git
cd CAD_0

cmake -B build -G Ninja \
  -DCMAKE_BUILD_TYPE=Release \
  -DCAD_0_BUILD_PYTHON=OFF \
  -DCAD_0_BUILD_TESTING=ON

cmake --build build
ctest --test-dir build
```

With Python bindings:

```bash
pip install cmake ninja nanobind scikit-build-core

cmake -B build -G Ninja \
  -DCMAKE_BUILD_TYPE=Release \
  -DCAD_0_BUILD_PYTHON=ON \
  -DCAD_0_BUILD_TESTING=ON \
  -DPython3_EXECUTABLE=$(which python3)

cmake --build build
```

Python smoke test:

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

Important troubleshooting note:

If CMake reports:

```text
Could NOT find Python3 (missing: Development.Module)
```

the solution is to install Python development headers or point CMake to the correct interpreter:

Debian/Ubuntu system Python:

```bash
sudo apt install python3-dev
```

Virtual environment:

```bash
-DPython3_EXECUTABLE=/path/to/venv/bin/python3
```

==================================================
2. GOALS OF THE WEBSITE
==================================================

Create a public website for CAD_0 that serves three purposes:

1. Presentation / landing page  
   Explain what CAD_0 is, why it exists, what it can do today, what is planned, and how a visitor can take a meaningful first step.

2. Educational handbook / treatise  
   Create a high-quality, textbook-like documentation area that explains how a dual-representation CAD kernel is designed and implemented. This is not a casual blog. It should read like a serious technical essay or textbook for people who want to understand CAD kernels, computational geometry, topology, determinism, meshing, booleans, scene graphs, file formats, and desktop app architecture.

3. Technical documentation  
   Provide practical documentation for building, running, testing, using Python bindings, using the desktop app, understanding the native format, importing/exporting, contributing, and reproducing CI behavior.

The website should feel like a credible open-source technical product and a learning resource at the same time.

==================================================
3. TARGET AUDIENCE
==================================================

Primary audience:

- People who want to learn CAD internals.
- People looking for an open, inspectable alternative to opaque CAD systems.
- Students and self-taught engineers interested in computational geometry.
- Hobbyist developers, CAD hackers, and curious makers.
- People who want a serious educational project, not just a toy demo.

Secondary audience:

- Software developers who want to build or extend the kernel.
- Researchers interested in SDF, B-Rep, deterministic geometry, topology validation, and open-source CAD foundations.

The site should not assume every visitor is an expert. It should welcome learners while remaining technically rigorous.

==================================================
4. POSITIONING AND TONE
==================================================

Position CAD_0 as:

- an open-source CAD kernel built from scratch
- a dual-representation geometry system: native SDF and native B-Rep
- an educational and research-grade foundation for understanding CAD
- a long-term alternative to depending on closed or heavyweight third-party CAD kernels
- not yet a complete daily-use CAD application

The tone must be:

- clear
- precise
- calm
- technically honest
- educational
- ambitious but not hype-driven
- suitable for an international English-speaking audience
- closer to a high-quality technical book than to a startup landing page

Avoid phrases like:

- “the next CAD revolution”
- “replace SolidWorks”
- “production-ready CAD”
- “complete parametric CAD”
- “enterprise-ready”
- “all features available”

Preferred phrasing:

- “CAD_0 is a from-scratch dual-representation CAD kernel.”
- “Today it provides a working foundation for SDF geometry, B-Rep topology, mesh extraction, native project files, and a desktop prototype.”
- “The long-term goal is a fully open, inspectable CAD system without third-party geometry kernels.”
- “Some advanced CAD workflows are planned and should be treated as roadmap items, not current capabilities.”

==================================================
5. NON-NEGOTIABLE RULES
==================================================

These rules are mandatory.

1. Do not invent features.
   Only present as available what is supported by the repository context above.

2. Do not present planned features as current features.
   Future CAD functionality may be shown, but only under clear labels such as Planned, Vision, Horizon, or Roadmap.

3. Use explicit status labels everywhere relevant.

   Suggested status taxonomy:

   - Available: implemented and usable today.
   - Partial: implemented for a limited subset or with known constraints.
   - Experimental: exists but not stable or not broadly validated.
   - Internal: present in the codebase but not exposed as a polished user-facing feature.
   - Planned: scheduled in the roadmap but not available yet.
   - Vision: long-term ambition, not committed implementation.
   - Research: conceptually interesting, possibly exploratory.

4. Every major claim should be traceable to:
   - repository README
   - ADR
   - source directory
   - test suite
   - roadmap phase
   - documented limitation

5. Do not create an automatic API reference now.
   No Doxygen, no mkdocstrings, no generated C++/Python API docs in the first version. Hand-written explanatory documentation is preferred.

6. The website should be almost independent from the code repository.
   It can live in a separate repository or a dedicated `website/` directory, but its content must accurately reflect the implementation. Avoid tight coupling to build artifacts. Use manual content first, with optional future synchronization for ADRs or status tables.

7. Diagrams are required.
   Use Mermaid or equivalent text-based diagrams where useful. Diagrams should explain architecture, pipelines, data flow, topology concepts, roadmap, and learning paths.

8. The landing page must be useful, not decorative.
   It should help a visitor decide what to do next within 30–60 seconds.

9. The handbook must be didactic but high-level.
   It should teach concepts, design decisions, trade-offs, pitfalls, and implementation rationale.

10. The technical docs must be operational.
   They should let a user reproduce a build, run tests, use Python, launch the app, understand the file format, and contribute.

11. Language:
   All website content must be in American English.

12. Do not pretend Windows/macOS are fully supported unless the repository proves it.
   The CI currently emphasizes Linux with GCC 11 and Clang 14. MSVC and other platforms may be listed as prerequisites or expected targets, but not as equally validated unless stated otherwise.

13. Hosting must be GitHub Pages free for a public repository.
    Do not make paid hosting part of the default MVP.
    GitHub Pages is the required deployment target.
    
==================================================
6. INFORMATION ARCHITECTURE
==================================================

Design the site around three logical areas, even if the first MVP collapses some of them into fewer pages.

Area 1: Home / Landing

Purpose:
Introduce CAD_0, communicate status, guide the visitor to a first meaningful action.

Required sections:

- Hero
  - project name
  - one-line definition
  - short value proposition
  - primary CTAs:
    - Get Started
    - Read the Handbook
    - View on GitHub
    - Open in Codespaces

- What is CAD_0?
  - dual representation
  - native SDF
  - native B-Rep
  - no third-party CAD kernel
  - deterministic by construction

- Who is this for?
  - learners
  - CAD enthusiasts
  - students
  - developers
  - researchers
  - contributors

- Current status
  - clear table of Available / Partial / Planned / Vision
  - no misleading feature list

- Capability map
  - SDF
  - B-Rep
  - meshing
  - booleans
  - file format
  - import/export
  - desktop app
  - Python bindings
  - testing/CI
  - roadmap items

- Choose your path
  Inspired by Gaggiuino’s decision-oriented style, but adapted to software:
  - I want to try it without installing anything
  - I want to build the kernel locally
  - I want to use it from Python
  - I want to use the desktop app
  - I want to understand how a CAD kernel works
  - I want to contribute

- First experiment
  A simple ritual:
  - open Codespaces
  - or build locally
  - run one SDF operation
  - extract one mesh
  - save one project
  - optionally share result in GitHub Discussions

- Roadmap
  - Phase A-D done
  - Phase E planned
  - Phase F planned
  - Phase H planned
  - vision items separated from committed roadmap

- Handbook teaser
  - explain that the site contains a textbook-like implementation guide

- Technical docs teaser
  - build, run, test, contribute

- Community / contributing
  - GitHub Discussions
  - ADR-first culture
  - good first issues, if defined later
  - do not invent a Discord server if none exists

Area 2: Handbook / Implementation Treatise

Purpose:
Teach how CAD_0 is designed and implemented, and more generally how a dual-representation CAD kernel can be built.

This should be the heart of the project.

Proposed chapter structure:

1. Introduction: What Is a CAD Kernel?
   - CAD application vs geometry kernel
   - why build from scratch
   - what “no third-party CAD kernel” means
   - current scope and limits

2. Why Dual Representation?
   - SDF strengths and weaknesses
   - B-Rep strengths and weaknesses
   - why not make one derivative of the other
   - dispatch on operand type
   - long-term bridge ambitions

3. Geometric Foundations
   - vectors, matrices, quaternions
   - transforms
   - bounding boxes
   - coordinate systems
   - floating-point reality
   - tolerance as a first-class citizen

4. Robust Predicates and Numerical Honesty
   - orientation tests
   - epsilon problems
   - Shewchuk predicates
   - why global epsilon is dangerous
   - determinism as a contract

5. Signed Distance Fields
   - definition
   - primitives
   - CSG
   - smooth unions and intersections
   - transforms
   - evaluation
   - batched evaluation
   - SIMD and multithreading
   - why SDF is not just a mesh in disguise

6. Mesh Extraction from SDF
   - marching cubes
   - isocontours
   - resolution vs quality
   - vertex welding
   - canonical edge keys
   - manifold concerns
   - export formats

7. Boundary Representation
   - faces, edges, vertices
   - coedges / halfedges / radial-edge alternatives
   - why radial-edge topology
   - topology queries
   - Euler characteristic
   - closed manifold validation
   - seam wires for analytic surfaces

8. Boolean Operations
   - SDF booleans vs B-Rep booleans
   - convex polyhedra current scope
   - Sutherland-Hodgman clipping
   - slab decomposition
   - IntersectionTable
   - SharedVertexPool
   - T-junction subdivision
   - validation contracts
   - known limitations

9. Scene Graph and Shape Model
   - `Shape` as `std::variant`
   - scene nodes
   - builder registry
   - persistent naming by genealogy
   - transforms and visibility
   - parametric rebuilding

10. Native Project Format
   - why a native format
   - `.CAD_0` v0.2.0
   - JSON feature tree
   - binary blob container
   - atomic save
   - transactional load
   - migration chain
   - bit-exact round-trip
   - dirty tracking

11. Import and Export
   - STL
   - OBJ
   - 3MF
   - vertex welding on import
   - mesh nodes as first-class scene objects
   - future STEP ambitions

12. Python Bindings
   - nanobind choice
   - exposing C++ safely
   - GIL considerations
   - Python usage patterns
   - stability expectations

13. Desktop App and Viewport
   - PySide6 as primary UI
   - headless-first viewport
   - Xvfb CI
   - picking
   - highlight
   - feature tree
   - property panel
   - undo/redo
   - create menu driven by builder registry

14. Testing, CI, and Determinism
   - doctest
   - unit tests
   - regression tests
   - golden files
   - ASan
   - warning audits
   - toolchain contract
   - CI matrix
   - why determinism matters in geometry

15. ADR Culture
   - what ADRs are
   - why ADR-first
   - how to read the project’s ADRs
   - how to propose architectural changes

16. Open Problems and Future Work
   - SDF ↔ B-Rep bridge
   - sketcher
   - constraint solving
   - feature history
   - STEP
   - advanced surfaces
   - assemblies
   - direct editing
   - drawings
   - GPU evaluation
   - collaboration

Each handbook chapter should include:

- concept explanation
- why it matters for CAD
- how CAD_0 currently implements or plans to implement it
- trade-offs
- common pitfalls
- relationship to ADRs
- small exercises or reflection questions
- links to relevant source directories or docs when appropriate
- status label if the topic is partially or fully future work

Area 3: Technical Documentation

Purpose:
Operational documentation for using, building, testing, and contributing.

Required pages:

1. Getting Started
   - prerequisites
   - quick choose-your-path section
   - first successful command

2. Prerequisites
   - C++20 compiler
   - GCC >= 11
   - Clang >= 14
   - MSVC >= 17.10 as listed prerequisite, with platform caveat
   - CMake >= 3.22
   - Ninja
   - Python >= 3.10 with dev headers for bindings

3. Build from Source
   - kernel only
   - kernel + tests
   - Python bindings
   - presets
   - debug/release
   - ASan
   - CI parity preset

4. GitHub Codespaces
   - one-click dev container
   - `bash scripts/start_codespaces.sh`
   - noVNC
   - Xvfb + fluxbox
   - app launch
   - troubleshooting

5. Running Tests
   - `ctest`
   - doctest
   - Python tests
   - headless UI tests
   - golden files
   - ASan

6. Python Usage
   - installation/build context
   - SDF primitives
   - CSG
   - smooth blends
   - evaluation
   - marching cubes
   - export
   - scene
   - save/load
   - limitations and unstable API notice

7. C++ Usage
   - include structure
   - minimal example
   - linking guidance
   - current recommendation to build from source
   - namespace usage
   - evaluation backend

8. Desktop App Guide
   - launching
   - Create menu
   - feature tree
   - property panel
   - viewport picking
   - undo/redo
   - import/export
   - save/load `.CAD_0`
   - dirty tracking
   - known limits

9. File Format
   - `.CAD_0`
   - versioning
   - JSON feature tree
   - binary blobs
   - atomic save
   - transactional load
   - migration chain
   - round-trip guarantees

10. Import/Export
   - STL
   - OBJ
   - 3MF
   - vertex welding
   - mesh scene nodes
   - format auto-detection by extension

11. Architecture Overview
   - directory layout
   - core modules
   - dependency direction
   - UI separation
   - concurrency
   - viewport
   - IO
   - bindings

12. Testing and CI
   - CI matrix
   - platform coverage
   - determinism checks
   - warning audits
   - toolchain contract

13. Contributing
   - branch from main
   - ADR-first
   - failing test before fix
   - commit style
   - code review expectations
   - respect determinism
   - do not introduce third-party CAD kernels without ADR

14. Troubleshooting
   - Python dev headers
   - CMake interpreter mismatch
   - Ninja/CMake issues
   - Codespaces noVNC issues
   - headless UI testing issues

15. Glossary
   - SDF
   - B-Rep
   - CSG
   - manifold
   - Euler characteristic
   - coedge
   - radial-edge
   - seam wire
   - T-junction
   - slab decomposition
   - atomic save
   - transactional load
   - golden file
   - ADR

==================================================
7. LANDING PAGE STYLE REQUIREMENTS
==================================================

The landing page should be useful above all.

It should answer:

- What is CAD_0?
- Why does it exist?
- What can I do today?
- What cannot I do yet?
- Where do I start?
- Where do I learn deeper?
- Where do I contribute?

Use a decision-oriented structure similar in spirit to Gaggiuino, but adapted to software:

1. Identify your goal.
2. Choose your path.
3. Prepare your environment.
4. Run your first experiment.
5. Read the handbook.
6. Join the discussion.

Avoid making the page look like a generic SaaS landing page. It should feel like the front door to a serious open-source technical project.

Include a prominent status banner near the top:

“CAD_0 is an early-stage, research-grade CAD kernel. Core geometry, SDF, B-Rep, meshing, native files, Python bindings, and a desktop prototype are already present. Advanced CAD workflows such as sketcher, full feature history, SDF ↔ B-Rep bridging, and STEP are planned.”

Include a compact “Current / Planned / Vision” table.

Include a “First experiment” block with copyable commands.

Include a “Choose your path” block with cards or links:

- Try in Codespaces
- Build locally
- Use Python
- Use the desktop app
- Read the handbook
- Contribute

Include a “Why this project is different” block:

- dual representation
- no third-party CAD kernel
- deterministic geometry
- ADR-driven architecture
- educational implementation handbook
- headless-tested UI

==================================================
8. HANDBOOK STYLE REQUIREMENTS
==================================================

The handbook should read like a technical treatise.

It should not be a simple tutorial.

It should teach:

- concepts
- design rationale
- implementation choices
- trade-offs
- failure modes
- validation strategies
- future directions

The voice should be authoritative but accessible.

Assume the reader is intelligent but not necessarily already expert in CAD kernels.

Each chapter should be self-contained enough to read independently, but part of a coherent progression.

Use diagrams liberally.

Use callouts:

- Note
- Warning
- Design decision
- Current limitation
- Planned work
- Exercise

Avoid overlong prose without structure. Use headings, lists, tables, and diagrams.

Where appropriate, include short code excerpts from the repository context, but do not turn the handbook into API reference.

The handbook should make a reader feel:

“I understand why CAD_0 is built this way, and I could contribute to or extend a project like this.”

==================================================
9. TECHNICAL DOCS STYLE REQUIREMENTS
==================================================

Technical docs should be concise, operational, and copy-paste friendly.

Prefer:

- numbered steps
- code blocks
- tables
- troubleshooting notes
- explicit prerequisites
- clear expected outputs

Avoid:

- vague instructions
- undocumented assumptions
- mixing conceptual explanation with operational steps without separation

Conceptual explanation belongs mostly in the handbook. Operational instructions belong mostly in technical docs. Cross-link between them.

==================================================
10. DIAGRAM REQUIREMENTS
==================================================

Create a diagram plan and then implement diagrams using Mermaid or equivalent.

Required diagrams, at minimum:

1. High-level system context
   - CAD_0 core
   - Python bindings
   - desktop app
   - file formats
   - tests/CI

2. Dual representation model
   - SDF domain
   - B-Rep domain
   - mesh extraction
   - future bridge

3. Shape variant model
   - SDF
   - Mesh
   - B-Rep
   - scene node

4. SDF evaluation pipeline
   - primitive/operator graph
   - transform
   - batched evaluation
   - SIMD/threading

5. Marching cubes + vertex welding pipeline
   - SDF
   - voxel sampling
   - triangle generation
   - canonical edge keys
   - welded mesh
   - export

6. B-Rep radial-edge topology
   - face
   - loop
   - coedge
   - edge
   - vertex

7. Boolean operation pipeline for convex polyhedra
   - input solids
   - clipping
   - slab decomposition
   - IntersectionTable
   - SharedVertexPool
   - T-junction subdivision
   - validation

8. Native `.CAD_0` file structure
   - JSON feature tree
   - binary blob container
   - atomic save
   - migration chain

9. Desktop app architecture
   - PySide6 UI
   - feature tree
   - property panel
   - viewport
   - kernel commands
   - undo/redo

10. Testing and CI pyramid
   - unit tests
   - regression tests
   - golden files
   - Python tests
   - headless UI tests
   - ASan
   - toolchain matrix

11. Roadmap timeline
   - Phase A-D done
   - Phase E planned
   - Phase F planned
   - Phase H planned
   - vision items separated

12. Learning path map
   - beginner
   - builder
   - Python user
   - app user
   - contributor
   - deep theory reader

Diagrams should be simple, readable, and maintainable. Do not create giant unreadable graphs.

==================================================
11. SITE INDEPENDENCE FROM REPOSITORY
==================================================

The website should be maintainable almost independently from the main code repository.

Recommended approach:

- Use a separate repository named something like:
  - `CAD_0-website`
  - `cad-zero-website`
  - `cad0-docs`

or, if preferred, a dedicated `website/` folder inside a docs repository.

The site should not depend on compiling the C++ project to build.

Content should be authored in Markdown or MDX.

Use a central status/data file, for example:

- `data/status.yml`
- `data/capabilities.json`
- `data/roadmap.yml`

This file should define:

- feature name
- status
- description
- links to docs
- links to ADR/source when available
- roadmap phase

Future optional enhancement:

- a script to pull ADR titles or selected markdown files from the main repository
- a script to verify that status labels match documented phases
- a link checker to ensure repository URLs remain valid

For now, keep synchronization manual but structured.

==================================================
12. RECOMMENDED TECH STACK
==================================================

Choose a static site stack suitable for:

- documentation
- landing page
- diagrams
- search
- dark mode
- GitHub Pages deployment
- long-form technical content
- low maintenance

Preferred option:

- Astro + Starlight

Reasons:

- good for both landing and docs
- MDX support
- component flexibility
- search
- dark mode
- Mermaid integration possible
- scalable if the handbook grows

Fallback option:

- MkDocs Material

Reasons:

- simpler
- Markdown-native
- excellent for docs
- fast to deploy
- less custom UI work

At Step 1, recommend one stack and explain trade-offs. Wait for approval before scaffolding.

Do not use a heavy custom React app unless absolutely necessary.

==================================================
13. DEPLOYMENT REQUIREMENTS — GITHUB PAGES FREE HOSTING
==================================================

The website must be deployable on GitHub Pages using free hosting for a public repository.

Do not propose paid hosting as the default option.
Do not require Vercel, Netlify, Cloudflare Pages, AWS, Firebase, or any external paid service for the MVP.
GitHub Pages is the required deployment target.

The site may be hosted either:

1. In a separate public repository, recommended:
   - example: `MarioW98/CAD_0-website`
   - resulting URL: `https://mariow98.github.io/CAD_0-website/`

2. In a repository named to produce a cleaner URL:
   - example: `MarioW98/cad0`
   - resulting URL: `https://mariow98.github.io/cad0/`

3. As a user/org root site:
   - example: `MarioW98/MarioW98.github.io`
   - resulting URL: `https://mariow98.github.io/`
   - use this only if the account root site is intentionally reserved for CAD_0.

4. Inside the main code repository under `docs/` or `website/`:
   - possible, but less independent.
   - preferred only if the user explicitly accepts tighter coupling with the code repository.

Because the user wants the website to be almost independent from the code repository, the recommended default is:

- separate public repository
- GitHub Pages
- GitHub Actions build/deploy workflow
- content authored in Markdown/MDX
- no dependency on compiling the C++ project to build the website

GitHub Pages requirements:

- Must work with a public repository and free GitHub Pages hosting.
- Must support HTTPS automatically.
- Must be deployable through GitHub Actions.
- Must include a `.github/workflows/deploy.yml` workflow.
- Must use the official GitHub Pages actions:
  - `actions/upload-pages-artifact`
  - `actions/deploy-pages`
- Must configure the required permissions:
  - `contents: read`
  - `pages: write`
  - `id-token: write`
- Must include concurrency control to avoid overlapping deployments.
- Must produce a static output directory suitable for GitHub Pages:
  - for Astro: usually `dist/`
  - for MkDocs: usually `site/`
  - for Docsify/plain HTML: repository root or a dedicated folder
- Must include instructions for enabling GitHub Pages in repository settings:
  - Settings → Pages → Build and deployment → Source: GitHub Actions
- Must include local preview instructions.
- Must include a troubleshooting section for common GitHub Pages issues:
  - blank page
  - wrong base path
  - assets not loading
  - 404 after deploy
  - workflow permission errors
  - Pages not enabled
  - cached old version
- Must include an optional custom-domain plan:
  - DNS configuration
  - `CNAME` file if required by the generator
  - GitHub Pages HTTPS certificate handling
  - but custom domain must remain optional, not required for MVP.

The deployment instructions must be concrete and copy-paste ready.

At Step 12, provide:

1. The exact repository setup.
2. The exact GitHub Pages settings path.
3. The exact GitHub Actions workflow file.
4. The exact local build command.
5. The exact local preview command.
6. The expected deployed URL pattern.
7. A minimal checklist to verify the deployment succeeded.

==================================================
14. ACCESSIBILITY AND QUALITY REQUIREMENTS
==================================================

The site must be accessible and professional.

Requirements:

- semantic headings
- sufficient color contrast
- keyboard navigable
- alt text for images/diagrams where applicable
- readable line lengths
- clear status labels not relying only on color
- responsive layout
- fast load time
- no unnecessary animation
- consistent terminology
- no broken internal links
- no invented external links
- clear distinction between available and planned functionality

==================================================
15. CONTENT CONSTRAINTS
==================================================

Use only the provided repository context as factual ground truth.

If something is not stated, treat it as unknown.

Do not invent:

- benchmarks
- performance numbers
- user counts
- community channels
- release dates
- package availability
- binary downloads
- compatibility claims
- API stability guarantees
- enterprise features
- certifications
- testimonials

If a claim is uncertain, mark it as:

- “to be verified”
- “not currently documented”
- “planned”
- “vision”

For Python and C++ examples, reuse the examples provided in the repository context or clearly mark simplified examples as illustrative.

The Python API should be described as currently unstable unless the repository states otherwise.

The desktop app should be described as a working prototype/primary UI, not a finished commercial CAD application.

B-Rep booleans should be described as currently focused on convex polyhedra, with validation and known constraints.

STEP, sketcher, feature history, and SDF ↔ B-Rep bridge must be described as planned, not available.

==================================================
16. MVP DEFINITION
==================================================

Define a realistic MVP that can be launched quickly.

MVP should include:

1. Home page
   - hero
   - status banner
   - what is CAD_0
   - current capability map
   - choose your path
   - first experiment
   - roadmap summary
   - links to handbook and technical docs

2. Handbook index
   - introduction
   - chapter list
   - at least 3 fully written chapters:
     - What Is a CAD Kernel?
     - Why Dual Representation?
     - Signed Distance Fields in CAD_0

3. Technical docs index
   - getting started
   - build from source
   - Codespaces
   - Python quickstart
   - desktop app quickstart
   - testing/CI summary
   - contributing summary

4. Diagrams
   - at least 5 core diagrams

5. Deployment
   - GitHub Pages workflow

6. Status data
   - central capability/status file

The MVP should be honest, useful, and expandable.

==================================================
17. WORKFLOW: STEP BY STEP
==================================================

You must work incrementally.

Do not output the entire website at once.

Use the following step sequence unless I explicitly ask to compress steps.

Step 0: Confirmation and MVP proposal
- Summarize your understanding.
- Confirm constraints.
- Propose the MVP scope.
- Ask whether to proceed to Step 1.

Step 1: Stack and repository structure
- Recommend Astro + Starlight or MkDocs Material.
- Explain trade-offs.
- Propose folder structure.
- Propose separate repo vs `website/` folder.
- Ask for approval.

Step 2: Information architecture and sitemap
- Produce final sitemap.
- Define navigation.
- Define page hierarchy.
- Define status labels.
- Ask for approval.

Step 3: Brand voice and content rules
- Produce style guide.
- Terminology list.
- Status taxonomy.
- Rules for Available / Partial / Planned / Vision.
- Ask for approval.

Step 4: Landing page copy
- Write full English copy for the home page.
- Include sections, CTAs, tables, and microcopy.
- Do not write site code yet.
- Ask for approval.

Step 5: Capability map and roadmap content
- Produce the central capability/status data.
- Produce roadmap table.
- Produce vision vs planned separation.
- Ask for approval.

Step 6: Handbook outline
- Produce detailed chapter outline.
- Include section headings for each chapter.
- Include diagram candidates.
- Include exercises/callouts.
- Ask for approval.

Step 7: First handbook chapters
- Write Chapter 1, Chapter 2, and Chapter 3 in full.
- Use textbook tone.
- Include diagrams as Mermaid code blocks.
- Ask for approval.

Step 8: Technical docs core pages
- Write Getting Started.
- Write Build from Source.
- Write Codespaces.
- Write Python Quickstart.
- Write Desktop App Quickstart.
- Write Testing/CI.
- Write Contributing.
- Ask for approval.

Step 9: Diagram implementation
- Produce all required Mermaid diagrams.
- Ensure they render cleanly.
- Place them in the correct pages.
- Ask for approval.

Step 10: Site scaffolding
- Create the chosen static site project.
- Provide exact commands.
- Provide config files.
- Provide navigation setup.
- Provide sample pages.
- Ask for approval.

Step 11: Content integration
- Insert approved copy into pages.
- Connect internal links.
- Add status badges/components if needed.
- Add search and dark mode configuration.
- Ask for approval.

Step 12: GitHub Pages deployment
- Provide the exact setup for free GitHub Pages hosting.
- Recommend a separate public repository for website independence.
- Provide repository naming options and resulting URLs.
- Provide the GitHub Pages settings path.
- Provide a complete GitHub Actions workflow YAML.
- Provide local build and preview commands.
- Explain how to verify the deployed site.
- Include troubleshooting for base path, blank page, 404, permissions, and cache issues.
- Keep custom domain optional.
- Ask for approval.

Step 13: Review and polish
- Audit for:
  - inaccurate claims
  - missing status labels
  - broken links
  - unclear navigation
  - mobile issues
  - diagram readability
  - tone inconsistencies
- Propose fixes.
- Ask whether to apply.

Step 14: Expansion plan
- Propose next chapters.
- Propose future docs.
- Propose optional community page.
- Propose optional blog/engineering log.
- Propose optional sync script from main repo.

At the end of each step, stop and wait for my response.

If I say “continue”, proceed to the next step.

If I say “revise”, modify the current step before moving on.

If I say “batch steps X-Y”, you may combine those steps, but still keep outputs organized and reviewable.

==================================================
18. OUTPUT FORMAT FOR EACH STEP
==================================================

For every step, structure your response as:

1. Decision / Summary
   - what you are proposing in this step

2. Deliverables
   - files, sections, tables, diagrams, or copy produced

3. Rationale
   - why this choice fits the project

4. Risks / Open Questions
   - anything uncertain or requiring my input

5. Next Step
   - what will happen next if I approve

Keep responses concrete. Avoid generic advice unless asked.

When producing files, use clear paths, for example:

- `src/pages/index.mdx`
- `src/content/docs/handbook/01-introduction.md`
- `src/content/docs/technical/getting-started.md`
- `data/capabilities.yml`
- `astro.config.mjs`
- `.github/workflows/deploy.yml`

When producing Markdown, make it ready to paste.

When producing code, include comments only where useful.

==================================================
19. STARTING INSTRUCTION
==================================================

Begin now with Step 0 only.

In Step 0:

- confirm you understand the project
- restate the target audience and positioning in 5–8 bullets
- propose the MVP scope
- list the main risks you see
- ask whether to proceed to Step 1

Do not write the website code yet.
Do not produce the full sitemap yet.
Do not produce the full landing copy yet.

Wait for my approval before Step 1.