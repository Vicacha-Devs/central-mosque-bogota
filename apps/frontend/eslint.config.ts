import css from "@eslint/css";
import js from "@eslint/js";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import stylistic from "@stylistic/eslint-plugin";
import vitest from "@vitest/eslint-plugin";
import * as parserAstro from "astro-eslint-parser";
import astro from "eslint-plugin-astro";
import betterTailwindcss from "eslint-plugin-better-tailwindcss";
import { importX } from "eslint-plugin-import-x";
import jestDOM from "eslint-plugin-jest-dom";
import { configs as sonarjs } from "eslint-plugin-sonarjs";
import storybook from "eslint-plugin-storybook";
import testingLibrary from "eslint-plugin-testing-library";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import { tailwind4 } from "tailwind-csstree";
import tseslint from "typescript-eslint";

// TODO: https://github.com/storybookjs/storybook/issues/34468
const sbConfigs = storybook.configs["flat/recommended"];
type SBConfig = Exclude<
  (typeof sbConfigs)[0],
  { plugins: { storybook: Record<string, unknown> } }
>;

export default defineConfig([
  globalIgnores([
    "coverage",
    "dist",
    "e2e",
    "playwright-report",
    "playwright.config.ts",
    "src/components/starwind",
    "storybook-static",
    "test-results",
    "node_modules",
    ".astro",
    ".github",
    ".vscode",
    "!.storybook",
    ".vercel",
  ]),
  {
    ...sonarjs.recommended,
    ignores: ["**/*.{json,md,css}"],
    rules: {
      "sonarjs/todo-tag": "warn",
    },
  },
  // Uncomment to enable TypeScript support without type checking to fast linting
  // https://typescript-eslint.io/getting-started/typed-linting/#performance
  // tseslint.configs.strict,
  // tseslint.configs.stylistic,
  stylistic.configs.recommended,
  importX.configs.typescript,
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}"],
    plugins: { js, "import-x": importX },
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      "@stylistic/brace-style": ["error", "1tbs", { allowSingleLine: true }],
      "@stylistic/function-paren-newline": "off", // oxfmt owns this
      "@stylistic/implicit-arrow-linebreak": "off",
      "@stylistic/object-curly-newline": "off", // oxfmt owns this
      "@typescript-eslint/array-type": [
        "error",
        {
          default: "generic",
        },
      ],
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-expect-error": "allow-with-description",
        },
      ],
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/explicit-function-return-type": 1,
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "typeParameter",
          format: ["PascalCase"],
          custom: { regex: "^T[A-Z]", match: true },
        },
      ],
      "import-x/no-extraneous-dependencies": [
        "error",
        { devDependencies: true },
      ],
      "import-x/no-unresolved": [
        "error",
        {
          ignore: ["^astro:"],
        },
      ],
      "indent": "off",
    },
  },
  astro.configs.recommended,
  astro.configs["jsx-a11y-recommended"],
  {
    files: ["**/*.astro"],
    extends: [betterTailwindcss.configs.recommended],
    settings: {
      "better-tailwindcss": {
        entryPoint: "./src/styles/global.css",
        detectComponentClasses: true,
      },
    },
    languageOptions: {
      parser: parserAstro,
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    rules: {
      // TODO: bug Astro support https://github.com/eslint-stylistic/eslint-stylistic/issues/259#issuecomment-4656201980
      "@stylistic/jsx-one-expression-per-line": "off",
      // `dark` is the Tailwind v4 custom-variant scope class (see PageHeroBanner).
      "better-tailwindcss/no-unknown-classes": [
        "error",
        { ignore: ["^dark$"] },
      ],
    },
  },
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts,astro}"],
    rules: {
      // oxfmt (prettier-style) keeps operators at the end of the line, so match it
      "@stylistic/operator-linebreak": [
        "warn",
        "after",
        {
          overrides: {
            "?": "before",
            ":": "before",
            "|": "before",
            "&": "before",
          },
        },
      ],
      // Whitespace/indentation is owned by oxfmt; these conflict with it
      "@stylistic/indent": "off",
      "@stylistic/indent-binary-ops": "off",
      "@stylistic/no-multiple-empty-lines": "off",
      "@stylistic/arrow-parens": ["error", "always"],
      "@stylistic/comma-dangle": [
        "error",
        {
          arrays: "always-multiline",
          objects: "always-multiline",
          generics: "always-multiline",
          imports: "always-multiline",
          exports: "always-multiline",
          functions: "only-multiline",
        },
      ],
      "@stylistic/linebreak-style": ["error", "unix"],
      "@stylistic/member-delimiter-style": [
        "error",
        {
          multiline: { delimiter: "semi", requireLast: true },
          singleline: { delimiter: "semi", requireLast: false },
        },
      ],
      "@stylistic/quote-props": ["error", "consistent"],
      "@stylistic/quotes": ["error", "double", { avoidEscape: true }],
      "@stylistic/semi": ["error", "always"],
      "eol-last": ["error", "always"],
      "max-len": [
        "error",
        {
          code: 80,
          ignoreComments: true,
          ignoreRegExpLiterals: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreUrls: true,
        },
      ],
      "no-trailing-spaces": ["error"],
    },
  },
  {
    files: ["**/*.json"],
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"],
  },
  {
    files: ["**/*.md"],
    plugins: { markdown },
    language: "markdown/gfm",
    extends: ["markdown/recommended"],
  },
  {
    files: ["**/*.css"],
    plugins: { css },
    extends: ["css/recommended"],
    language: "css/css",
    languageOptions: {
      customSyntax: tailwind4,
    },
    rules: {
      // Tailwind v4 theme tokens and component-scoped custom properties
      // are defined outside the linted file.
      "css/no-invalid-properties": ["error", { allowUnknownVariables: true }],
      // ::marker and content-visibility are progressive enhancements.
      "css/use-baseline": "warn",
    },
  },
  {
    files: ["src/**/*.test.[tj]s?(x)"],
    ignores: ["src/**/*.e2e.test.[tj]s?(x)"],
    ...jestDOM.configs["flat/recommended"],
    ...testingLibrary.configs["flat/react"],
    ...vitest.configs.recommended,
    rules: {
      ...vitest.configs.recommended.rules,
      "vitest/valid-title": [
        "error",
        {
          mustMatch: {
            it: [
              "^should.*when.+$",
              "Test title must include 'should' and 'when'",
            ],
          },
        },
      ],
    },
    settings: {
      vitest: {
        typecheck: true,
      },
    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
  },
  // TODO: https://github.com/storybookjs/storybook/issues/34468
  ...(sbConfigs as unknown as Array<SBConfig>),
]);
