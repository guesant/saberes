import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import stylistic from "@stylistic/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import airbnb from "eslint-config-airbnb";
import boundaries from "eslint-plugin-boundaries";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import sonarjs from "eslint-plugin-sonarjs";
import architecture from "../packages/pkg-tooling-eslint/src/architecture.plugin.mjs";
import importFormat from "../packages/pkg-tooling-eslint/src/import-format.plugin.mjs";
import layout from "../packages/pkg-tooling-eslint/src/layout.plugin.mjs";

const airbnbPackageDirectory = dirname(fileURLToPath(import.meta.resolve("eslint-config-airbnb")));

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
  resolvePluginsRelativeTo: airbnbPackageDirectory,
});

const airbnbConfigs = compat.config(airbnb)
  .map((config) => {
    return Object.fromEntries(
      Object.entries(config)
        .filter(([key]) => {
          return key !== "plugins";
        }),
    );
  });

const sourceFiles = ["**/*.{js,jsx,mjs,ts,tsx}"];

const presentationFiles = ["packages/app/src/**/*.{js,jsx,ts,tsx}"];

const uiFiles = [
  "packages/pkg-ui/src/**/*.{js,jsx,ts,tsx}",
  "packages/pkg-ui-content/src/**/*.{js,jsx,ts,tsx}",
];

const layoutProtectedFiles = [
  "packages/app/src/**/*.{js,jsx,ts,tsx}",
  "packages/pkg-ui-content/src/**/*.{js,jsx,ts,tsx}",
];

const layoutImplementationFiles = [
  "packages/app/src/**/*.{js,jsx,ts,tsx}",
  "packages/pkg-ui/src/**/*.{js,jsx,ts,tsx}",
  "packages/pkg-ui-content/src/**/*.{js,jsx,ts,tsx}",
];

const uiImplementationFiles = [
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
  "architecture/no-anonymous-complex-types": "error",
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
  "architecture/no-forbidden-type-casts": "error",
  "architecture/layer-boundaries": "error",
  "architecture/composition-root": "error",
  "architecture/no-domain-in-presentation": "error",
  "architecture/no-adapter-cross-import": "error",
  "architecture/application-purity": "error",
  "architecture/domain-purity": "error",
  "architecture/cqrs-layer-boundaries": "error",
  "architecture/mvvm-layer-boundaries": "error",
  "architecture/port-contract": "error",
  "architecture/adapter-contract": "error",
  "architecture/adapter-dependency-injection": "error",
  "architecture/constructor-dependency-inversion": "error",
  "architecture/file-name-contract": "error",
  "architecture/file-kind-location": "error",
  "architecture/file-kind-contract": "error",
  "architecture/no-low-level-layout-outside-ui": "error",
  "architecture/ui-component-prefix": "error",
};

const safetyRules = {
  ...architectureRules,
  "arrow-body-style": ["error", "always"],
  curly: ["error", "all"],
  "import/first": "error",
  "import/extensions": [
    "error",
    "never",
    {
      js: "never",
      jsx: "never",
      mjs: "always",
      ts: "never",
      tsx: "never",
    },
  ],
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
  "no-ternary": "warn",
  "no-unreachable": "error",
  "no-unsafe-optional-chaining": "error",
  "no-unneeded-ternary": "warn",
  "react/jsx-one-expression-per-line": "off",
  eqeqeq: ["error", "always"],
  "consistent-return": "error",
  "@stylistic/arrow-parens": ["error", "always"],
  "@stylistic/dot-location": ["error", "property"],
  "@stylistic/indent": ["error", 2],
  "@stylistic/newline-per-chained-call": [
    "error",
    {
      ignoreChainWithDepth: 1,
    },
  ],
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
  "@stylistic/semi": ["error", "always"],
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
  "no-nested-ternary": "warn",
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
  ...airbnbConfigs,
  stylistic.configs["disable-legacy"],
  {
    files: sourceFiles,
    languageOptions,
    plugins: {
      architecture,
      boundaries,
      import: importPlugin,
      "import-format": importFormat,
      layout,
      "@stylistic": stylistic,
      "jsx-a11y": jsxA11y,
      react,
      "react-hooks": reactHooks,
      sonarjs,
    },
    settings: {
      react: { version: "19.1" },
      "boundaries/root-path": ".",
      "boundaries/dependency-nodes": ["import", "require", "dynamic-import", "export"],
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".mjs", ".ts", ".tsx"],
          moduleDirectory: ["node_modules", "."],
        },
      },
      "boundaries/elements": [
        { type: "domain", pattern: "packages/pkg-domain", partialMatch: false },
        {
          type: "application-commands",
          pattern: "packages/pkg-application/src/commands",
          partialMatch: false,
        },
        {
          type: "application-queries",
          pattern: "packages/pkg-application/src/queries",
          partialMatch: false,
        },
        {
          type: "application-ports",
          pattern: "packages/pkg-application/src/ports",
          partialMatch: false,
        },
        { type: "application", pattern: "packages/pkg-application", partialMatch: false },
        { type: "adapter", pattern: "packages/pkg-adapter-*", partialMatch: false },
        { type: "ui-content", pattern: "packages/pkg-ui-content", partialMatch: false },
        { type: "ui", pattern: "packages/pkg-ui", partialMatch: false },
        { type: "app-composition", pattern: "packages/app/src/composition", partialMatch: false },
        { type: "app-presentation", pattern: "packages/app", partialMatch: false },
        { type: "utils", pattern: "packages/pkg-utils", partialMatch: false },
        { type: "data", pattern: "packages/thedata", partialMatch: false },
        { type: "tooling", pattern: "packages/pkg-tooling", partialMatch: false },
        { type: "tooling", pattern: "packages/pkg-tooling-eslint", partialMatch: false },
      ],
      "boundaries/files": [
        { category: "tooling", pattern: ".local/operator/**" },
        { category: "config", pattern: ".config/**" },
      ],
    },
    rules: {
      ...safetyRules,
      "import-format/no-empty-line-between-imports": "error",
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          policies: [
            { allow: [{ to: { module: { origin: ["external", "core"] } } }] },
            {
              from: { element: { type: "domain" } },
              allow: [{ to: { element: { type: "domain" } } }],
            },
            {
              from: { element: { type: "application" } },
              allow: [
                {
                  to: {
                    element: {
                      type: [
                        "application",
                        "application-commands",
                        "application-queries",
                        "application-ports",
                        "domain",
                      ],
                    },
                  },
                },
              ],
            },
            {
              from: { element: { type: "application-commands" } },
              allow: [
                {
                  to: {
                    element: {
                      type: ["application", "application-commands", "application-ports", "domain"],
                    },
                  },
                },
              ],
            },
            {
              from: { element: { type: "application-queries" } },
              allow: [
                {
                  to: {
                    element: {
                      type: ["application", "application-queries", "application-ports", "domain"],
                    },
                  },
                },
              ],
            },
            {
              from: { element: { type: "application-ports" } },
              allow: [
                { to: { element: { type: ["application", "application-ports", "domain"] } } },
              ],
            },
            {
              from: { element: { type: "adapter" } },
              allow: [{ to: { element: { type: ["adapter", "application", "domain"] } } }],
            },
            { from: { element: { type: "ui" } }, allow: [{ to: { element: { type: "ui" } } }] },
            {
              from: { element: { type: "ui-content" } },
              allow: [{ to: { element: { type: ["ui-content", "ui", "application"] } } }],
            },
            {
              from: { element: { type: "app-composition" } },
              allow: [
                {
                  to: {
                    element: {
                      type: [
                        "app-composition",
                        "app-presentation",
                        "application",
                        "application-commands",
                        "application-queries",
                        "application-ports",
                        "adapter",
                        "ui",
                        "ui-content",
                      ],
                    },
                  },
                },
              ],
            },
            {
              from: { element: { type: "app-presentation" } },
              allow: [
                {
                  to: {
                    element: {
                      type: [
                        "app-composition",
                        "app-presentation",
                        "application",
                        "application-commands",
                        "application-queries",
                        "ui",
                        "ui-content",
                      ],
                    },
                  },
                },
              ],
            },
            {
              from: { element: { type: "utils" } },
              allow: [{ to: { element: { type: "utils" } } }],
            },
            {
              from: { file: { categories: ["tooling", "config", "data"] } },
              allow: [
                { to: { file: { categories: ["tooling", "config", "data"] } } },
                { to: { element: { type: "tooling" } } },
                {
                  to: {
                    element: { type: ["adapter", "application", "domain"] },
                  },
                },
              ],
            },
            {
              from: { element: { type: "tooling" } },
              allow: [
                {
                  to: {
                    element: { type: ["tooling", "adapter", "application", "domain"] },
                  },
                },
              ],
            },
          ],
          checkAllOrigins: true,
          checkUnknownLocals: true,
          checkInternals: true,
        },
      ],
      "boundaries/no-unknown-files": "error",
      "boundaries/no-unknown-dependencies": ["error", { require: "any" }],
      "boundaries/no-ignored-dependencies": "error",
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
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
    files: operatorFiles,
    rules: {
      "import/extensions": [
        "error",
        "never",
        {
          js: "never",
          jsx: "never",
          mjs: "always",
          ts: "always",
          tsx: "always",
        },
      ],
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
    files: [".config/**/*.{js,jsx,mjs,ts,tsx}", ...operatorFiles],
    languageOptions: {
      globals: { Deno: "readonly" },
    },
    rules: {
      "import/no-extraneous-dependencies": "off",
      "import/no-unresolved": "off",
      "no-undef": "off",
    },
  },
  {
    files: [
      "packages/pkg-tooling-eslint/src/**/*.{js,jsx,mjs,ts,tsx}",
      "packages/pkg-tooling/src/**/*.tool.ts",
    ],
    rules: {
      "architecture/one-exported-function-per-file": "off",
      "architecture/no-sql-outside-repository": "off",
      "architecture/purposeful-naming": "off",
      "func-names": "off",
      "import/no-extraneous-dependencies": "off",
      "no-await-in-loop": "off",
      "no-console": "off",
      "no-continue": "off",
      "no-fallthrough": "off",
      "no-restricted-syntax": "off",
      "no-use-before-define": "off",
      "architecture/max-function-parameters": "off",
    },
  },
  {
    files: operatorFiles,
    rules: {
      "architecture/layer-boundaries": "off",
      "architecture/one-exported-function-per-file": "off",
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
  {
    files: sourceFiles,
    ignores: generatedFiles,
    rules: {
      "layout/no-mui-stack": "error",
      "layout/ui-box-only-structural-rendering": "error",
    },
  },
  {
    files: layoutProtectedFiles,
    ignores: ["**/*.test.ts", "**/*.test.tsx"],
    rules: {
      "layout/no-style-definition-outside-ui": "error",
      "layout/no-spacing-definition-outside-ui": "error",
      "layout/no-layout-definition-outside-ui": "error",
      "layout/no-negative-spacing-outside-ui": "error",
    },
  },
  {
    files: uiImplementationFiles,
    ignores: ["**/*.test.ts", "**/*.test.tsx"],
    rules: {
      "layout/spacing-contract": "error",
    },
  },
  {
    files: layoutImplementationFiles,
    ignores: ["**/*.test.ts", "**/*.test.tsx"],
    rules: {
      "layout/action-group-contract": "error",
      "layout/bottom-navigation-contract": "error",
      "layout/content-group-contract": "error",
      "layout/surface-inset-contract": "error",
      "layout/no-full-width-control-outside-ui": "error",
      "layout/form-control-label-contract": "error",
      "layout/no-technical-form-copy": "error",
    },
  },
];
