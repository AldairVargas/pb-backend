import js from "@eslint/js";
import globals from "globals";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node, // Esto habilita 'process'
    },
    rules: {
      "no-console": "off",
      "no-unused-vars": "warn",
    },
  },
  js.configs.recommended,
];
