---
title: Getting Started
description: Prerequisites and quick paths.
---

# Getting Started

Welcome to the CAD_0 technical documentation. This guide will help you choose the right path to interact with the kernel based on your goals.

## Prerequisites

Before building or running CAD_0, ensure your environment meets these minimum requirements:

- **C++20 compiler**: the CI-tested columns are **GCC 14** and **Clang 19** on ubuntu-24.04 — the CMake presets pin them (`g++-14` / `clang++-19`), so a preset build *is* the toolchain the CI judges. Older compilers may build via a plain `cmake -B build`, but are not CI-tested. Windows/MSVC is registered as a preset, not CI-tested.
- **Build system**: CMake >= 3.22 and Ninja.
- **Python (optional but recommended)**: Python >= 3.10 with development headers installed — needed for the nanobind bindings and the desktop app.

## Choose Your Path

1. **I want to try it instantly without installing anything**
   Proceed to the [GitHub Codespaces](./codespaces/) guide.
2. **I want to build the C++ kernel locally**
   Proceed to [Build from Source](./build-from-source/).
3. **I want to script geometry operations**
   Proceed to the [Python Quickstart](./python-quickstart/).
4. **I want to use the graphical interface**
   Proceed to the [Desktop App Guide](./desktop-app-guide/).
