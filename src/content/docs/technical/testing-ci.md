---
title: Testing and CI
description: Understanding the CAD_0 testing pyramid and CI matrix.
---

Determinism and correctness are non-negotiable in CAD_0. The testing infrastructure is designed to catch regressions before they merge.

## The Testing Pyramid

1. **Unit Tests**: C++ `doctest` suite covering core math, SDF, and B-Rep operations.
2. **Regression Tests**: Byte-identical golden files ensure evaluation values never silently change.
3. **Python Tests**: Validates the `nanobind` exposure and Python-side logic.
4. **Headless UI Tests**: PySide6 viewport and UI interactions tested under Xvfb.

## Running Tests Locally

After building with `-DCAD_0_BUILD_TESTING=ON`:

```bash
# Run all C++ tests
ctest --test-dir build

# Run Python tests (from the build directory)
cd build/python
pytest # or the specific test runner configured in the repo
```

## CI Matrix

The GitHub Actions CI enforces the following matrix on `ubuntu-22.04`:
- GCC 11 (Debug with AddressSanitizer)
- GCC 11 (Release)
- Clang 14 (Release)

:::tip[Toolchain Contract]
Fixes must not silently change evaluation values. All PRs are checked against golden files. If a legitimate algorithmic improvement changes output, the golden files must be explicitly updated with justification.
:::
```

---
