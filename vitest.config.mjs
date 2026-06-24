import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    {
      name: "svg-stub",
      enforce: "pre",
      load(id) {
        if (id.match(/\.svg(\?react)?$/)) {
          return "export default () => null;";
        }
      },
    },
  ],
  resolve: {
    alias: [
      { find: /^@\//, replacement: resolve(__dirname, "src") + "/" },
      { find: "@Shared", replacement: resolve(__dirname, "src/components/Shared") },
      { find: "@workers", replacement: resolve(__dirname, "src/workers") },
    ],
  },
  test: {
    environment: "jsdom",
    include: ["tests/unit/**/*.spec.{js,jsx,ts,tsx}"],
  },
});
