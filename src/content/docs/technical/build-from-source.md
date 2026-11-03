---
title: Build from Source
description: Step-by-step instructions for building the CAD_0 kernel, tests, and Python bindings.
---

This guide covers building CAD_0 from source using CMake and Ninja.

## 1. Clone the Repository

```bash
git clone https://github.com/MarioW98/CAD_zero.git
cd CAD_zero
```

## 2. Kernel and Tests Only (No Python)

To build the core C++ kernel and run the C++ test suite:

```bash
cmake -B build -G Ninja \
  -DCMAKE_BUILD_TYPE=Release \
  -DCAD_0_BUILD_PYTHON=OFF \
  -DCAD_0_BUILD_TESTING=ON

cmake --build build
ctest --test-dir build
```

## 3. Build with Python Bindings

To expose the kernel to Python via `nanobind`:

```bash
# Install Python build dependencies
pip install cmake ninja nanobind scikit-build-core

# Configure and build
cmake -B build -G Ninja \
  -DCMAKE_BUILD_TYPE=Release \
  -DCAD_0_BUILD_PYTHON=ON \
  -DCAD_0_BUILD_TESTING=ON \
  -DPython3_EXECUTABLE=$(which python3)

cmake --build build
```

:::caution[Troubleshooting: Python Development Headers]
If CMake reports `Could NOT find Python3 (missing: Development.Module)`, you must install Python development headers.

- **Debian/Ubuntu (system Python)**: `sudo apt install python3-dev`
- **Virtual environment**: pass `-DPython3_EXECUTABLE=/path/to/venv/bin/python3` so CMake picks the right interpreter.
- **Multiple Python versions**: CMake may find Python 3.13 (with headers) when your venv uses 3.12 (without). Always pass `-DPython3_EXECUTABLE=` explicitly.
:::

## 4. Build Presets and Debugging

- **Presets**: `cmake --preset linux-gcc-release` (or `linux-clang`, or `linux-gcc-debug` with ASan; `linux-python` configures the bindings build). The presets pin the CI's compilers themselves (`g++-14` / `clang++-19`): a preset build **is** the toolchain the CI judges — see the *Toolchain contract* in the repository's `docs/audits/`.
- **Debug with AddressSanitizer (ASan)**: use the `linux-gcc-debug` preset, or add `-DCMAKE_BUILD_TYPE=Debug` and ensure your compiler supports the sanitizer flags.
- **CI parity**: the CI runs the full matrix on ubuntu-24.04 — GCC 14 debug (ASan/UBSan) + release, and Clang 19. See [Testing and CI](./testing-ci/).
