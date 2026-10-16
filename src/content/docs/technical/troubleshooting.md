
---
title: Contributing
description: Guidelines for contributing code, documentation, or architectural decisions to CAD_0.
---

Thank you for your interest in contributing to CAD_0. Please adhere to the following core principles.

## Core Principles

1. **ADR-First Culture**: Major architectural changes must be proposed and documented via an Architecture Decision Record (ADR) in `docs/adr/` *before* implementation.
2. **Test-Driven Regressions**: If you are fixing a bug, write a failing test that reproduces the bug *before* applying the fix.
3. **Respect Determinism**: Do not introduce floating-point non-determinism. Changes must pass bit-identical round-trip tests.
4. **No Third-Party Kernels**: Do not introduce external geometry kernels (e.g., OpenCASCADE, CGAL) without a thoroughly debated and approved ADR.

## Workflow

1. Fork the repository and branch from `main`.
2. Make your changes, ensuring code compiles cleanly with no new warnings.
3. Add or update tests to cover your changes.
4. Submit a Pull Request with a clear description linking to any relevant ADRs or issues.

:::note[Commit Style]
Use clear, descriptive commit messages. Reference issue numbers where applicable.
:::
```

---

**File: `src/content/docs/technical/troubleshooting.md`**
```markdown
---
title: Troubleshooting
description: Solutions to common build, runtime, and CI issues.
---

## CMake: Could NOT find Python3

**Error**: `Could NOT find Python3 (missing: Development.Module)`  
**Solution**: Install Python development headers.
- Ubuntu/Debian: `sudo apt install python3-dev`
- If using a virtual environment, explicitly point CMake to it:  
  `-DPython3_EXECUTABLE=/path/to/venv/bin/python3`

## CMake / Ninja Configuration Failures

**Error**: `Ninja build system not found` or CMake generator errors.  
**Solution**: Ensure Ninja is installed and in your PATH.  
- Ubuntu/Debian: `sudo apt install ninja-build`  
- Python: `pip install ninja`

## Codespaces: noVNC Black Screen

**Error**: The noVNC web interface loads but shows a black screen or "Connection closed".  
**Solution**: 
1. Check the terminal running `bash scripts/start_codespaces.sh` for errors.
2. Ensure Xvfb and fluxbox started successfully.
3. Try reloading the noVNC page or restarting the script.

## Headless UI Testing Failures

**Error**: UI tests fail locally but pass in CI, or vice versa.  
**Solution**: Ensure you are running the tests in a headless environment (e.g., `xvfb-run ctest ...`) to match the CI environment exactly. Software-GL rendering can behave differently on host GPUs.
```
