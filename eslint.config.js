import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";

export default [
  js.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  eslintConfigPrettier,
  {
    languageOptions: {
      globals: {
        ...globals.browser, // This fixes window, document, setTimeout, etc.
      },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "vue/multi-word-component-names": "off",
      "vue/no-v-html": "off",
      // Temporary off for now, we can turn it back on later
      "vue/no-mutating-props": "off",
    },
  },
  {
    ignores: ["dist/", "node_modules/"],
  },
];