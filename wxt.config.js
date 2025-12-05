import { resolve } from "path";
import svgr from "vite-plugin-svgr";
import { defineConfig } from "wxt";

import pkg from "./package.json";

export default defineConfig({
  modules: ["@wxt-dev/module-react"],

  manifest: {
    manifest_version: 3,
    name: "Fake news debunker by InVID, WeVerify & VeraAI",
    version: pkg.version,
    description: "InVID WeVerify VeraAI extension",
    short_name: "Verification Plugin",

    action: {
      default_title: "InVID WeVerify VeraAI",
      default_popup: "popup.html",
    },

    permissions: [
      "contextMenus",
      "webNavigation",
      "activeTab",
      "scripting",
      "tabs",
    ],

    host_permissions: ["<all_urls>"],

    // icons: {
    //   16: "icon-16.png",
    //   48: "icon-48.png",
    //   128: "icon-128.png",
    // },

    content_security_policy: {
      extension_pages:
        "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';",
    },

    web_accessible_resources: [
      {
        resources: [
          "c2paAssets/toolkit_bg.wasm",
          "entrypoints/content-scripts/inject.js",
        ],
        matches: ["<all_urls>"],
      },
    ],

    externally_connectable: {
      matches: ["<all_urls>"],
    },
  },

  srcDir: "src",

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
  }),
});
