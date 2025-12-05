import { resolve } from "path";
import svgr from "vite-plugin-svgr";
import { defineConfig } from "wxt";

import pkg from "./package.json";

const env = import.meta.env.VITE_ENVIRONMENT;

export default defineConfig({
  modules: ["@wxt-dev/module-react", "@wxt-dev/auto-icons"],

  autoIcons: {
    developmentIndicator: "overlay",
    baseIconPath:
      env === "production"
        ? "public/icon-128.png"
        : "public/img/icon-staging.png",
  },

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
