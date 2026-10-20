---
title: GitHub Codespaces
description: Launch a pre-configured CAD_0 development environment in your browser.
---

CAD_0 provides a fully configured GitHub Codespaces environment, eliminating local setup friction and replicating exactly the same software-GL stack used in CI UI tests.

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
3. You will see the CAD_0 desktop application running via noVNC.

:::note[Why Software-GL?]
The Codespaces environment uses the same software-GL stack (Mesa llvmpipe) as the CI UI tests. This ensures that what you see in Codespaces is a faithful reproduction of what the automated headless tests validate on every push.
:::

## Troubleshooting

:::caution[noVNC Black Screen]
If the noVNC screen is black:
1. Check the terminal running `bash scripts/start_codespaces.sh` for errors.
2. Ensure Xvfb and fluxbox started successfully.
3. Try reloading the noVNC page or restarting the script.
:::

:::tip[Reusing Codespaces]
Codespaces can be paused and resumed from the GitHub UI. Your build artifacts and Python environment are preserved between sessions.
:::

See `CODESPACES.md` in the repository for advanced troubleshooting and configuration details.
```

---
