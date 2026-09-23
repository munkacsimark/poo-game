// ESLint only runs what oxlint can't: the React Hooks / React Compiler rules.
// Everything oxlint already covers is switched off by eslint-plugin-oxlint.
import oxlint from "eslint-plugin-oxlint";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist", "coverage", "playwright-report", "test-results"]),
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      globals: globals.browser,
    },
    extends: [reactHooks.configs.flat["recommended-latest"]],
  },
  ...oxlint.buildFromOxlintConfigFile("./.oxlintrc.json"),
]);
