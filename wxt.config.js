import { resolve } from "path";
import svgr from "vite-plugin-svgr";
import { defineConfig } from "wxt";

import pkg from "./package.json";

export default defineConfig({
  modules: ["@wxt-dev/module-react", "@wxt-dev/auto-icons"],

  manifestVersion: 3,

  autoIcons: {
    developmentIndicator: "overlay",
    baseIconPath: "assets/icon-128.png",
  },

  manifest: ({ mode, browser }) => ({
    name: "Fake news debunker by InVID, WeVerify & VeraAI",
    version: pkg.version,
    description: "InVID WeVerify VeraAI extension",
    short_name: "Verification Plugin",

    action: {
      default_title: "InVID WeVerify VeraAI",
      default_popup: "popup.html",
    },

    permissions: [
      "storage",
      "contextMenus",
      "webNavigation",
      "activeTab",
      "scripting",
      "tabs",
    ],

    host_permissions: ["<all_urls>"],

    content_security_policy: {
      extension_pages:
        mode === "production"
          ? "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';"
          : "script-src 'self' 'wasm-unsafe-eval' http://localhost:* http://127.0.0.1:*; object-src 'self';",
    },

    web_accessible_resources: [
      {
        resources: ["c2paAssets/toolkit_bg.wasm", "content-scripts/inject.js"],
        matches: ["<all_urls>"],
      },
    ],

    // externally_connectable is Chrome-only
    ...(browser === "chrome" && {
      externally_connectable: {
        matches: ["<all_urls>"],
      },
    }),
  }),

  srcDir: "src",
  outDir: "build",
  publicDir: "public",

  zip: {
    zipSources: false,
  },

  alias: {
    "@workers": resolve(__dirname, "src/workers"),
    "@Shared": resolve(__dirname, "src/components/Shared"),
  },

  vite: () => ({
    plugins: [
      svgr({
        include: "**/*.svg",
        svgrOptions: {
          icon: true,
        },
      }),
    ],
    server: {
      // Disable HMR
      // hmr: false,
    },
  }),
});
