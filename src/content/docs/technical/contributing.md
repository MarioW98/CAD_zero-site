---
title: Contributing
description: Guidelines for contributing code, documentation, or architectural decisions to CAD_0.
---

Thank you for your interest in contributing to CAD_0. The project follows strict architectural and engineering principles to maintain determinism, traceability, and honesty across the codebase.

## Core Principles

### 1. ADR-First Culture
**Every major architectural change must be proposed, reviewed, and recorded as an Architecture Decision Record (ADR) in `docs/adr/` before implementation begins.**

The project currently maintains over 29 ADRs covering topics such as:
- ADR-0002: SDF as a first-class `std::variant`
- ADR-0003: No third-party CAD kernels
- ADR-0005: Persistent naming by genealogy (not geometric signature)
- ADR-0012: Radial-edge B-Rep topology (not half-edge)
- ADR-0014: Cross-platform FP determinism via `-ffp-contract=off`
- ADR-0026: SDF → B-Rep bridge under hard topology contracts
- ADR-0027: Boolean feature slice (Phase F)
- ADR-0029: Twist warp contract

If you want to propose a new primitive, a new topology structure, or a major refactor, draft an ADR first.

### 2. Test-Driven Regressions
- **Write a failing test that reproduces the bug *before* applying the fix.**
- Regressions are fixed by first adding a test case to `tests/`, verifying it fails, then fixing the kernel.

### 3. Respect Determinism (ADR-0014)
- Do not introduce floating-point non-determinism.
- Fixes must **not** silently change evaluation values.
- All changes must pass **bit-identical round-trip tests** and **byte-identical golden files**.
- If a legitimate algorithmic improvement changes output, the golden files must be explicitly updated with justification in the PR.

### 4. No Third-Party CAD Kernels (ADR-0003)
- Do not introduce external geometry kernels (OpenCASCADE, CGAL, Parasolid, etc.) without a thoroughly debated and approved ADR.
- CGAL GPL modules are explicitly forbidden (ADR-0013).

## Workflow

1. **Open a Codespace** (everything needed to build, run and test ships in the dev container).
2. **Branch from `main`** with a descriptive name.
3. **Make your changes**, ensuring code compiles cleanly with no new warnings.
4. **Add or update tests** to cover your changes.
5. **Run the full CI matrix locally** using the pinned preset:
   ```bash
   cmake --preset linux-gcc11-ci
   cmake --build build
   ctest --test-dir build
   ```
6. **Submit a Pull Request** with a clear description linking to any relevant ADRs or issues.

## Commit Style
- Use clear, descriptive commit messages.
- Reference issue numbers where applicable.
- Atomic commits: one logical change per commit.

## Toolchain Contract

Warning audits and any `-Werror` change must be verified against the CI compilers (GCC 11.4, Clang 14) before push. Reproduce the exact CI environment locally via the `linux-gcc11-ci` preset. See the audits in `docs/audits/`.

## License

CAD_0 is licensed under **Apache-2.0**. Vendored Shewchuk robust predicates under `third_party/robust_predicates/` are public domain. The `[ui]` extra pulls in PySide6 (LGPL-3.0) — dynamic import, replaceable, notices required for closed-source derivatives. Full inventory: `docs/audits/2026-10-16-third-party-license-audit.md`.