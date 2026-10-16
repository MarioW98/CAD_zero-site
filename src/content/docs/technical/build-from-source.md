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
- **Debian/Ubuntu**: `sudo apt install python3-dev`
- **Virtual Environment**: Pass `-DPython3_EXECUTABLE=/path/to/venv/bin/python3` to CMake.
:::

## 4. Build Presets and Debugging

- **Debug with AddressSanitizer (ASan)**: Add `-DCMAKE_BUILD_TYPE=Debug` and ensure your compiler supports ASan flags.
- **CI Parity**: To replicate the exact CI environment, use GCC 11 or Clang 14 on Ubuntu 22.04 with `-DCMAKE_BUILD_TYPE=Release`.
```

---

**File: `src/content/docs/technical/codespaces.md`**
```markdown
---
title: GitHub Codespaces
description: Launch a pre-configured CAD_0 development environment in your browser.
---

CAD_0 provides a fully configured GitHub Codespaces environment, eliminating local setup friction.

## 1. Launch Codespaces

1. Navigate to the [CAD_0 repository](https://github.com/MarioW98/CAD_zero).
2. Click the green **Code** button.
3. Select the **Codespaces** tab and click **Create codespace on main**.

## 2. Start the Development Environment

Once the Codespace is ready, open the integrated terminal and run:

```bash
bash scripts/start_codespaces.sh
```

This script will:
1. Build the C++ kernel and Python package.
2. Start an Xvfb (virtual framebuffer) and `fluxbox` window manager.
3. Expose a noVNC interface on port `6080`.
4. Launch the CAD_0 desktop application.

## 3. Access the Desktop App

1. In the Codespace terminal output, locate the forwarded URL for port `6080` (e.g., `https://<codespace-name>-6080.app.github.dev`).
2. Open this URL in your browser.
3. You will see the CAD_0 desktop application running via noVNC, using the same software-GL stack as the CI UI tests.

:::note[Troubleshooting]
If the noVNC screen is black, ensure the `start_codespaces.sh` script completed without errors. Check the terminal output for Xvfb or fluxbox startup failures.
:::
```

---

**File: `src/content/docs/technical/python-quickstart.md`**
```markdown
---
title: Python Quickstart
description: Using the CAD_0 kernel from Python via nanobind bindings.
---

:::caution[API Stability]
The Python API is currently **unstable**. Breaking changes may occur without major version bumps as the kernel evolves.
:::

## 1. Smoke Test

After building with `-DCAD_0_BUILD_PYTHON=ON` (see [Build from Source](/technical/build-from-source/)), run this quick validation:

```bash
cd build/python
python3 -c "
import sys; sys.path.insert(0, '.')
import CAD_0

# 1. Create an SDF primitive
sph = CAD_0.sdf.sphere(radius=2.0)
print(sph.describe())

# 2. Extract a mesh
mesh = CAD_0.sdf.marching_cubes(sph, resolution=16)
print(f'Vertices: {mesh.vertex_count()}, Triangles: {mesh.triangle_count()}')
"
```

**Expected Output:**
```text
Sphere(radius=2.0)
Vertices: 480, Triangles: 960
```

## 2. Common Operations

- **CSG Operations**: Use native SDF boolean operators (`union`, `subtract`, `intersect`) and smooth blends.
- **Evaluation**: Batched, vectorized evaluation is handled automatically via `xsimd` under the hood.
- **Export**: Extracted meshes can be exported to STL, OBJ, or 3MF formats.

:::tip[Performance]
For heavy scripting, ensure you are running the Release build. Debug builds will evaluate SDFs significantly slower due to lack of vectorization optimizations.
:::
```

---

**File: `src/content/docs/technical/desktop-app-guide.md`**
```markdown
---
title: Desktop App Guide
description: Operating the PySide6 CAD_0 desktop prototype.
---

The CAD_0 desktop application is a working prototype built with PySide6. It serves as the primary UI for interacting with the kernel.

## Core Features

- **Registry-Driven Create Menu**: Geometry primitives and operations are registered dynamically by the kernel.
- **Feature Tree**: Displays the parametric history of the current document.
- **Parametric Property Panel**: Edit parameters of selected nodes in real-time.
- **Viewport Picking**: Select geometry in the 3D view. Selected items receive an **amber 3D highlight**.
- **Undo/Redo**: Full command-stack support for reversible operations.
- **Dirty Tracking**: The UI indicates when the document has unsaved changes.

## File Operations

- **Open / Save / Save As**: Saves to the native `.CAD_0` format (v0.2.0).
- **Import**: Supports STL and OBJ files (includes automatic vertex welding on import).
- **Export**: Supports STL, OBJ, and 3MF formats.

:::note[Known Limits]
This is a prototype. Advanced workflows like 2D sketching, constraint solving, and full feature history are **Planned** (Phase F) and not yet available.
:::
```

---
