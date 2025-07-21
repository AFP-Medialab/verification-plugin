import react from "eslint-plugin-react";

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends("eslint:recommended", "plugin:react/recommended"),
  {
    plugins: {
      react,
    },

    settings: {
      react: {
        version: "detect", // Or specify the exact version, e.g., '18.0'
      },
    },

    files: ["**/*.js", "**/*.jsx"],

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.webextensions,
      },

      ecmaVersion: "latest",
      sourceType: "module",
    },

    rules: {
      "react/prop-types": "off",
    },
  },
];
