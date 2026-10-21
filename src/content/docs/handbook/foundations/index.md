---
title: "Part I — Foundations"
description: The anatomy of a CAD system, the case for dual representation, and the numerical ground rules of deterministic geometry.
sidebar:
  order: 0
---

# Part I — Foundations

Every serious piece of engineering software rests on a small number of ideas that must be understood before any algorithm can be appreciated. For a CAD kernel, those ideas are four. First, the *anatomy of the system*: what a geometry kernel actually is, what it is responsible for, and where its duties end — Chapter 1. Second, the *representational hypothesis*: why CAD_0 keeps signed distance fields and boundary representation as two coequal ways of describing shape, rather than converting everything into one canonical form — Chapter 2. Third, the *mathematical toolkit*: vectors, transforms and bounding boxes, treated with full awareness that computers store real numbers only approximately — Chapter 3. Fourth, the *numerical honesty* that follows from that awareness: tolerances and robust predicates, without which no geometric program survives contact with real inputs — Chapter 4.

The order is deliberate, and it mirrors the order in which CAD_0 itself was built. Determinism was designed into the project before the first sphere was ever tessellated, because a kernel that evaluates the same shape differently on different machines — or on the same machine on a Tuesday — cannot support the contracts that later parts of the book rely upon: bit-identical round-trips, byte-identical golden files, pinned vertex-edge-face counts in the SDF → B-Rep bridge. Foundations, in this book, are not a courtesy introduction; they are load-bearing.

| Ch. | Chapter | Status |
| --- | --- | --- |
| 1 | [Introduction: What Is a CAD Kernel?](introduction/) | ✍️ drafted |
| 2 | Why Dual Representation? | ⏳ planned |
| 3 | Geometric Foundations | ⏳ planned |
| 4 | Robust Predicates | ⏳ planned |

By the end of Part I you will be able to read the rest of the handbook with the right instincts: to ask of every algorithm not only *does it work?* but *what does it assume about its inputs, and what happens one epsilon away from the boundary case?* That question — and the discipline of answering it in advance — is the common thread of everything that follows.
