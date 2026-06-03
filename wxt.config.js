import { resolve } from "path";
import { transformWithOxc } from "vite";
import { defineConfig } from "wxt";
import { createFilter } from '@rollup/pluginutils';
import pkg from "./package.json";
import { promises as fs } from "node:fs";
import { transform as svgrTransform } from "@svgr/core";
import jsx from "@svgr/plugin-jsx";

export default defineConfig({
  modules: ["@wxt-dev/module-react", "@wxt-dev/auto-icons"],

  manifestVersion: 3,

  autoIcons: {
    developmentIndicator: "overlay",
    baseIconPath: "assets/icon-128.png",
  },

  manifest: ({ mode, browser }) => ({
    name: "Fake news debunker InVID WeVerify VeraAI",
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
        resources: ["c2paAssets/toolkit_bg.wasm", "content-scripts/inject.js", "content-scripts/sna-bridge.js"],
        matches: ["<all_urls>"],
      },
    ],

    // externally_connectable is Chrome-only
    ...(browser === "chrome" && {
      externally_connectable: {
        matches: ["<all_urls>"],
      },
    }),

    // Firefox requires explicit addon ID for storage API to work
    ...(browser === "firefox" && {
      browser_specific_settings: {
        gecko: {
          id: "weverify@localhost.dev",
          strict_min_version: "142.0",
          data_collection_permissions: {
            required:["locationInfo"],
            optional: ["technicalAndInteraction"]
          }
        },
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
      vitePluginSvgr({svgrOptions: {icon: true}})
    ],

    server: {
      // Disable HMR
      // hmr: false,
    },
  }),
});

/**
 * This function is meant to outpass the regression of Oxc used in Vite 8+ (to replace EsBuild) about the svg files imported as React component.
 * It was given in this issue on Vite GitHub : https://github.com/pd4d10/vite-plugin-svgr/issues/141
 * 
 * @returns plugin
 */
function vitePluginSvgr({ svgrOptions, include = "**/*.svg?react", exclude } = {}) {
    const filter = createFilter(include, exclude);
    const postfixRE = /[?#].*$/s;
    let isBuild = false;
    let resolvedConfig;
    return {
        name: "vite-plugin-svgr",
        enforce: "pre",
        configResolved(config) {
            resolvedConfig = config;
            isBuild = config.command === "build";
        },
        async load(id) {
            if (filter(id)) {
              // get the code of the REact component associated to the SVG
              const filePath = id.replace(/[?#].*$/s, "");
              
              const svgCode = await fs.readFile(filePath, "utf8");
              const componentCode = await svgrTransform(
                svgCode,
                { icon: true },
                { filePath, caller: { defaultPlugins: [jsx] } },
              );

              // Dev: read JSX config from resolved Vite config (set by @vitejs/plugin-react)
              const jsxOptions = resolvedConfig?.oxc?.jsx ?? { runtime: "automatic" };
              const res = await transformWithOxc(componentCode, id, { lang: "jsx", jsx: jsxOptions });
              return { code: res.code, map: null };
            }
        },
    };
}
