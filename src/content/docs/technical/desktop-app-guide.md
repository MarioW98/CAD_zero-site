---
title: Desktop App Guide
description: Operating the PySide6 CAD_0 desktop prototype.
---

The CAD_0 desktop application is a working prototype built with PySide6 (ADR-0006). It serves as the primary UI for interacting with the kernel, featuring parametric shape creation, tree-based boolean operations, and a headless-first viewport architecture.

## Core Features

### Create Menu (Builder Registry)
The **Create** menu is driven by the kernel's builder registry (`core/scene/builders.hpp`). Adding a builder in C++ automatically adds it to the UI — single source of truth.

### Feature Tree & Property Panel
- **Feature tree**: Displays the parametric history of the current document as a DAG.
- **Parametric property panel**: Edit parameters (radius, height, etc.) of selected nodes in real-time. Every edit rebuilds the body and is fully undoable.

### Boolean Operations as Tree Features (ADR-0027)
Boolean operations are first-class tree nodes, not one-shot mesh operations:
1. Select two SDF bodies in the viewport or feature tree.
2. Choose **Edit → Subtract** (or Union/Intersect).
3. An operation node of type `CSG` joins the tree.
4. Operands are referenced by `FeatureId`, auto-hidden in the viewport but still editable in the property panel.
5. Placement offsets are world-anchored — edits propagate through the DAG bit-identically.

:::note[Id-Stable Undo/Redo]
Undo and redo restore the **same node ids**, so external references (e.g., property panel bindings) remain valid. Deleting an operand leaves a visible `CSG!` dangling state with an actionable message — never a silent rebind.
:::

### Viewport Picking
Click a shape in the 3D view (SDF or imported mesh) to select it. The tree, the property panel and an **amber 3D highlight** all follow, regardless of selection origin.

### Debug Menu: Topological Inspector
The **Debug** menu reports the topological invariants of any selected body:
- **χ (Euler characteristic)**
- **Genus** (derived only for single closed-orientable shells)
- **Closed-orientable** status (`is_closed_orientable`)

This is particularly useful for validating SDF → B-Rep extractions (Phase E) and genus-1 shapes like pierced boxes.

## File Operations

- **Open / Save / Save As** (`Ctrl+O`, `Ctrl+S`, `Ctrl+Shift+S`) in the native `.CAD_0` format (v0.3.0):
  - **Atomic save**: Writes `<file>.tmp` then renames. A crash never destroys the previous file.
  - **Transactional load**: The document is fully validated before the scene is touched. Corrupted or newer-version files raise explicit errors.
  - **Recipes = source of truth**: Boolean operation recipes are canonical; bodies are the cache.
  - **Migration chain**: v0.1.0 → v0.2.0 → v0.3.0 files open seamlessly.
  - **Dirty tracking**: Any scene change flags the project; closing prompts to save.
- **Import**: STL and OBJ files (vertices welded, counts reported).
- **Export**: STL, OBJ, and 3MF formats. Format auto-detected from extension.

## Known Limits

:::caution[Prototype Status]
This is a working prototype, not a finished commercial CAD application. The following are **planned** roadmap items:
- **2D Sketcher** with constraint solving (Phase F, next step after boolean slice)
- **Full feature history** with persistent naming by genealogy
- **Assemblies** and **direct editing** (Vision)
- **STEP AP203** import/export (Phase H)
:::