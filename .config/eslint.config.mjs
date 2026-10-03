import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import stylistic from "@stylistic/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import boundaries from "eslint-plugin-boundaries";
import importPlugin from "eslint-plugin-import";
import sonarjs from "eslint-plugin-sonarjs";
import architecture from "./eslint/architecture-plugin.mjs";
import importFormat from "./eslint/import-format-plugin.mjs";

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

const sourceFiles = ["**/*.{js,jsx,mjs,ts,tsx}"];

const presentationFiles = ["packages/app/src/**/*.{js,jsx,ts,tsx}"];

const uiFiles = [
  "packages/pkg-ui/src/**/*.{js,jsx,ts,tsx}",
  "packages/pkg-ui-content/src/**/*.{js,jsx,ts,tsx}",
];

const operatorFiles = [".local/operator/**/*.{js,jsx,mjs,ts,tsx}"];

const generatedFiles = [
  "**/node_modules/**",
  "**/dist/**",
  "**/.cache/**",
  "**/generated/**",
  "**/public/data/**",
];

const languageOptions = {
  parser: typescriptParser,
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
};

const architectureRules = {
  "architecture/no-explicit-any": "error",
  "architecture/no-aggregated-adapters": "error",
  "architecture/one-class-per-file": "error",
  "architecture/cqrs-file-contract": "error",
  "architecture/domain-function-purity": "error",
  "architecture/domain-functions-in-domain-package": "error",
  "architecture/no-generic-identifiers": "error",
  "architecture/no-generic-props-type-name": "error",
  "architecture/no-inline-object-type-in-parameters": "error",
  "architecture/max-function-parameters": ["error", 3],
  "architecture/no-unsafe-double-cast": "error",
  "architecture/no-unjustified-suppression": "error",
  "architecture/one-exported-function-per-file": "error",
  "architecture/one-interface-per-file": "error",
  "architecture/one-type-per-file": "error",
  "architecture/purposeful-naming": "error",
  "architecture/utils-module-boundary": "error",
  "architecture/wildcard-reexports-only": "error",
  "architecture/no-named-reexports": "error",
  "architecture/no-parent-reexports": "error",
  "architecture/execute-single-parameter": "error",
  "architecture/no-sql-outside-repository": "error",
};

const safetyRules = {
  ...architectureRules,
  curly: ["error", "all"],
  "import/first": "error",
  "import/newline-after-import": ["error", { count: 1 }],
  "import/no-duplicates": "error",
  "import/order": [
    "error",
    {
      alphabetize: { caseInsensitive: true, order: "asc" },
      groups: ["builtin", "external", "internal", "parent", "sibling", "index", "object", "type"],
      "newlines-between": "ignore",
    },
  ],
  "no-constant-condition": "error",
  "no-extra-boolean-cast": "error",
  "no-fallthrough": "error",
  "no-implicit-coercion": "error",
  "no-labels": "error",
  "no-redeclare": "error",
  "no-shadow": "error",
  "no-unreachable": "error",
  "no-unsafe-optional-chaining": "error",
  "no-unneeded-ternary": "error",
  "react/jsx-one-expression-per-line": "off",
  eqeqeq: ["error", "always"],
  "consistent-return": "error",
  "@stylistic/padding-line-between-statements": [
    "error",
    {
      blankLine: "always",
      prev: "*",
      next: "*",
    },
    {
      blankLine: "never",
      prev: "import",
      next: "import",
    },
    {
      blankLine: "never",
      prev: "directive",
      next: "directive",
    },
  ],
};

const presentationRules = {
  ...safetyRules,
  "architecture/component-props-contract": "error",
  "architecture/conditional-rendering-delegation": "error",
  "architecture/map-to-imported-component": "error",
  "architecture/no-class-component": "error",
  "architecture/no-complex-inline-handler": "error",
  "architecture/padding-around-type-statements": "error",
  "react/jsx-max-depth": ["error", { max: 3 }],
  "react/jsx-filename-extension": ["error", { extensions: [".js", ".jsx", ".ts", ".tsx"] }],
  "react/react-in-jsx-scope": "off",
  "react/jsx-uses-vars": "error",
  "react/no-multi-comp": ["error", { ignoreStateless: false }],
  "react/no-unstable-nested-components": "error",
  complexity: ["error", 5],
  "max-depth": ["error", 2],
  "max-lines": ["error", { max: 150, skipBlankLines: true, skipComments: true }],
  "max-lines-per-function": ["error", { max: 35, skipBlankLines: true, skipComments: true }],
  "max-nested-callbacks": ["error", 2],
  "max-statements": ["error", 15],
  "no-nested-ternary": "error",
  "sonarjs/no-all-duplicated-branches": "error",
  "sonarjs/cognitive-complexity": ["error", 7],
  "sonarjs/no-duplicated-branches": "error",
  "sonarjs/no-gratuitous-expressions": "error",
  "sonarjs/no-identical-conditions": "error",
  "sonarjs/no-identical-expressions": "error",
  "sonarjs/no-identical-functions": ["error", 5],
  "sonarjs/no-nested-conditional": "error",
  "sonarjs/no-redundant-assignments": "error",
  "sonarjs/no-redundant-jump": "error",
  "sonarjs/no-useless-catch": "error",
  "sonarjs/no-useless-increment": "error",
};

export default [
  { ignores: generatedFiles },
  ...compat.extends("airbnb"),
  stylistic.configs["disable-legacy"],
  {
    files: sourceFiles,
    languageOptions,
    plugins: {
      architecture,
      boundaries,
      import: importPlugin,
      "import-format": importFormat,
      "@stylistic": stylistic,
      sonarjs,
    },
    settings: {
      react: { version: "19.1" },
      "boundaries/root-path": ".",
      "boundaries/files": [
        { category: "domain", pattern: "packages/pkg-domain/**" },
        { category: "application", pattern: "packages/pkg-application/**" },
        { category: "adapter", pattern: "packages/pkg-adapter-*/**" },
        { category: "utils", pattern: "packages/pkg-utils/**" },
        { category: "data", pattern: "packages/thedata/**" },
        { category: "ui", pattern: "packages/pkg-ui*/**" },
        { category: "feature", pattern: "packages/app/src/features/**" },
        { category: "app", pattern: "packages/app/**" },
        { category: "tooling", pattern: ".tools/**" },
        { category: "config", pattern: ".config/**" },
      ],
    },
    rules: {
      ...safetyRules,
      "import-format/no-empty-line-between-imports": "error",
      "boundaries/dependencies": ["error", { default: "allow" }],
      "boundaries/no-unknown-files": "off",
      "boundaries/no-unknown-dependencies": "off",
      "boundaries/no-ignored-dependencies": "off",
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "import/extensions": "off",
      "import/no-unresolved": "off",
      "no-undef": "off",
      "no-unused-vars": "off",
      "import/prefer-default-export": "off",
      "react/destructuring-assignment": "off",
      "react/prop-types": "off",
      "react/require-default-props": "off",
    },
  },
  {
    files: ["packages/pkg-application/src/use-cases/**/*.ts"],
    rules: {
      "max-classes-per-file": "off",
    },
  },
  {
    files: ["**/*.test.ts", "**/*.test.tsx"],
    rules: {
      "import/no-extraneous-dependencies": "off",
    },
  },
  {
    files: ["**/index.ts", "**/index.tsx"],
    rules: {
      "@stylistic/padding-line-between-statements": "off",
    },
  },
  {
    files: ["packages/pkg-adapter-*/src/**/*.ts"],
    rules: {
      "class-methods-use-this": "off",
    },
  },
  {
    files: ["packages/app/src/test/**/*.ts", "packages/app/tests/**/*.ts"],
    rules: {
      "import/no-extraneous-dependencies": "off",
    },
  },
  {
    files: [
      ".tools/**/*.{js,jsx,mjs,ts,tsx}",
      ".config/**/*.{js,jsx,mjs,ts,tsx}",
      ".github/**/*.{js,jsx,mjs,ts,tsx}",
      ...operatorFiles,
    ],
    rules: {
      "class-methods-use-this": "off",
      "func-names": "off",
      "no-await-in-loop": "off",
      "no-console": "off",
      "no-continue": "off",
      "no-restricted-syntax": "off",
    },
  },
  { files: presentationFiles, rules: presentationRules },
  {
    files: presentationFiles,
    ignores: uiFiles,
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@mui/*", "@emotion/*", "motion/react-m"],
              message: "Visual implementation dependencies are only allowed in UI layers.",
            },
            {
              group: [
                "@fontsource/*",
                "cytoscape",
                "echarts",
                "graphology",
                "katex",
                "react-complex-tree",
                "react-markdown",
                "rehype-katex",
                "rehype-sanitize",
                "remark-gfm",
                "remark-math",
                "three",
                "valibot",
              ],
              message:
                "Use the package that owns this capability instead of importing it from app.",
            },
          ],
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXOpeningElement > JSXIdentifier[name=/^[a-z]/]",
          message: "Native HTML and SVG elements are only allowed in UI layers.",
        },
      ],
      "architecture/no-visual-props-outside-ui": "off",
    },
  },
  {
    files: uiFiles,
    rules: {
      ...presentationRules,
      "react/jsx-props-no-spreading": "off",
    },
  },
  {
    files: [
      ".tools/**/*.{js,jsx,mjs,ts,tsx}",
      ".config/**/*.{js,jsx,mjs,ts,tsx}",
      ...operatorFiles,
    ],
    languageOptions: {
      globals: { Deno: "readonly" },
    },
    rules: {
      "import/no-extraneous-dependencies": "off",
      "import/no-unresolved": "off",
      "no-undef": "off",
    },
  },
  { files: uiFiles, rules: { "architecture/no-mui-reexport": "error" } },
  {
    files: ["packages/app/src/i18n/locales/**/*.locale.ts"],
    rules: { "max-lines": "off" },
  },
  {
    files: [
      "packages/app/src/content/block-view.component.tsx",
      "packages/app/src/content/visualization/**/*.component.tsx",
      "packages/pkg-ui-content/src/block-view.component.tsx",
      "packages/pkg-ui-content/src/visualization/**/*.component.tsx",
    ],
    rules: {
      "architecture/conditional-rendering-delegation": "off",
      "architecture/map-to-imported-component": "off",
      complexity: "off",
      "max-lines-per-function": "off",
      "max-nested-callbacks": "off",
      "new-cap": "off",
      "no-nested-ternary": "off",
      "sonarjs/no-nested-conditional": "off",
    },
  },
  {
    files: ["**/index.ts", "**/index.tsx"],
    rules: {
      "@stylistic/padding-line-between-statements": "off",
    },
  },
];
