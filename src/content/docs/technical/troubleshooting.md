---
title: Troubleshooting
description: Solutions to common build, runtime, and CI issues.
---

## CMake: Could NOT find Python3

**Error**: `Could NOT find Python3 (missing: Development.Module)`
**Solution**: Install Python development headers, or point CMake at the right interpreter.

- Ubuntu/Debian (system Python): `sudo apt install python3-dev`
- Virtual environment: pass `-DPython3_EXECUTABLE=/path/to/venv/bin/python3` explicitly.
- Multiple Python versions: CMake may find Python 3.13 (with headers) when your venv uses 3.12 (without). Always pass `-DPython3_EXECUTABLE=` explicitly.

## CMake / Ninja Configuration Failures

**Error**: `Ninja build system not found` or CMake generator errors.
**Solution**: Ensure Ninja is installed and in your PATH.

- Ubuntu/Debian: `sudo apt install ninja-build`
- Python: `pip install ninja`
- Alternatively, use a preset: `cmake --preset linux-gcc-release` — the presets pin the CI's compilers themselves (`g++-14` / `clang++-19`).

## Codespaces: noVNC Black Screen

**Error**: The noVNC web interface loads but shows a black screen or "Connection closed".
**Solution**:

1. Check the terminal running `bash scripts/start_codespaces.sh` for errors.
2. Ensure Xvfb and fluxbox started successfully.
3. Try reloading the noVNC page or restarting the script.

## Headless UI Testing Failures

**Error**: UI tests fail locally but pass in CI, or vice versa.
**Solution**: Ensure you are running the tests in a headless environment (e.g., `xvfb-run ctest ...`) to match the CI environment exactly. Software-GL rendering can behave differently on host GPUs.
