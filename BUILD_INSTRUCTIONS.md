# Build instructions (Firefox)

Requirements: Node.js >= 20, pnpm 10.33.0 (`corepack enable && corepack prepare pnpm@10.33.0 --activate`).

1. The `.env.production` file at the project root is included in this archive. It only contains the `VITE_*` service URLs, which are inlined in the built extension.
2. `pnpm install --frozen-lockfile`
3. `pnpm run build:firefox:production`

Output: `build/firefox-mv3/` (WXT + Vite: bundling, minification, JSX and SVGR transforms).
