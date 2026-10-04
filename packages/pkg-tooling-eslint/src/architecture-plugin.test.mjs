import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import test from "node:test";
import architecture from "./architecture.plugin.mjs";

const require = createRequire(resolve(process.cwd(), "package.json"));

const babelParser = require("@babel/eslint-parser");

const { Linter, RuleTester } = require("eslint");

const languageOptions = {
  parser: babelParser,
  parserOptions: {
    requireConfigFile: false,
    babelOptions: { parserOpts: { plugins: ["typescript", "jsx"] } },
  },
};

export function verify(code, rule, filename = "<input>.ts") {
  const linter = new Linter({ configType: "flat" });

  const config = [
    {
      files: ["**/*.{js,jsx,mjs,ts,tsx}"],
      languageOptions,
      plugins: { architecture },
      rules: { [`architecture/${rule}`]: "error" },
    },
  ];

  return filename === "<input>.ts"
    ? linter.verify(code, config)
    : linter.verify(code, config, { filename: resolve(process.cwd(), filename) });
}

export function runRuleCases(name, rule, cases) {
  const ruleTester = new RuleTester({ languageOptions });

  ruleTester.run(name, rule, cases);
}

test("map-to-imported-component accepts an imported self-closing component", () => {
  assert.equal(
    verify(
      "import Card from './Card'; items.map((item) => <Card key={item.id} item={item} />);",
      "map-to-imported-component",
    ).length,
    0,
  );
});

test("map-to-imported-component rejects local, native, fragment and nested JSX results", () => {
  for (const code of [
    "const Card = () => null; items.map((item) => <Card item={item} />);",
    "items.map((item) => <div>{item.name}</div>);",
    "items.map((item) => <><Card item={item} /></>);",
    "import Card from './Card'; items.map((item) => <Card><span>{item.name}</span></Card>);",
  ]) {
    assert.equal(verify(code, "map-to-imported-component").length, 1);
  }
});

test("component-props-contract enforces props and the named contract", () => {
  assert.equal(
    verify(
      "type CardProps = { title: string }; function Card(props: CardProps) { return <span>{props.title}</span>; }",
      "component-props-contract",
    ).length,
    0,
  );

  assert.equal(
    verify(
      "type Props = { title: string }; function Card({ title }: Props) { return <span>{title}</span>; }",
      "component-props-contract",
    ).length,
    1,
  );
});

test("conditional-rendering-delegation accepts an imported branch", () => {
  assert.equal(
    verify(
      "import Empty from './Empty'; function View(props: ViewProps) { return props.empty && <Empty />; }",
      "conditional-rendering-delegation",
    ).length,
    0,
  );
});

test("conditional-rendering-delegation rejects an inline visual branch", () => {
  assert.equal(
    verify(
      "function View(props: ViewProps) { return props.empty && <div />; }",
      "conditional-rendering-delegation",
    ).length,
    1,
  );
});

test("typescript safety rules reject any and double casts", () => {
  assert.equal(verify("const value: any = 1;", "no-explicit-any").length, 1);

  assert.equal(
    verify("const value = input as unknown as string;", "no-unsafe-double-cast").length,
    1,
  );
});

test("no-forbidden-type-casts rejects unsafe casts without a justification", () => {
  for (const code of [
    "const value = input as never;",
    "const value = input as any;",
    "const value = input as Record<string, string>;",
    "const value = input as unknown;",
  ]) {
    assert.equal(verify(code, "no-forbidden-type-casts").length, 1);
  }
});

test("no-forbidden-type-casts accepts a nearby explicit justification", () => {
  for (const code of [
    "// awkward-type-ignore: legacy parser output has no runtime discriminator\nconst value = input as never;",
    "const value = input as unknown; // awkward-type-ignore: browser API lacks a typed declaration",
  ]) {
    assert.equal(verify(code, "no-forbidden-type-casts").length, 0);
  }
});

test("no-anonymous-complex-types allows primitives, simple unions and named declarations", () => {
  assert.equal(
    verify(
      `
        type LessonId = string;
        type LessonMetadata = { title: string };
        type LessonHandler = (lessonId: string) => void;
        const lessonId: string | null = null;
        const lessonIds: string[] = [];
        const metadata: LessonMetadata = { title: "Lesson" };
        const handler: LessonHandler = () => undefined;
      `,
      "no-anonymous-complex-types",
    ).length,
    0,
  );
});

test("no-anonymous-complex-types allows named generic references and interface members", () => {
  assert.equal(
    verify(
      `
        interface LessonMetadata {
          title: string;
          tags: string[];
        }
        type LessonIndex = Record<string, LessonMetadata>;
        type LessonIdentifier = string | null;
      `,
      "no-anonymous-complex-types",
    ).length,
    0,
  );
});

test("no-anonymous-complex-types rejects complex inline annotations", () => {
  for (const code of [
    "const metadata: { title: string } = { title: 'Lesson' };",
    "function readLesson(input: { lessonId: string }): string { return input.lessonId; }",
    "const handler: (lessonId: string) => void = () => undefined;",
    "const lessonPair: [string, number] = ['lesson', 1];",
    "type LessonEnvelope = { metadata: { title: string } };",
    "interface LessonEnvelope { metadata: { title: string } }",
    "function readLesson<T extends { lessonId: string }>(input: T): string { return input.lessonId; }",
    "const lessonEnvelope = { metadata: { title: 'Lesson' } } satisfies { metadata: { title: string } };",
  ]) {
    assert.ok(verify(code, "no-anonymous-complex-types").length > 0);
  }
});

test("wildcard-reexports-only allows wildcard exports only in index files", () => {
  assert.equal(
    verify('export * from "./value";', "wildcard-reexports-only", "packages/pkg-ui/src/index.ts")
      .length,
    0,
  );

  assert.equal(
    verify(
      'export * from "./value";',
      "wildcard-reexports-only",
      "packages/pkg-ui/src/button.component.tsx",
    ).length,
    1,
  );

  assert.equal(
    verify(
      'export { value } from "./value";',
      "wildcard-reexports-only",
      "packages/pkg-ui/src/button.component.tsx",
    ).length,
    0,
  );
});

test("no-named-reexports rejects named re-exports", () => {
  assert.equal(verify('export { value } from "./value";', "no-named-reexports").length, 1);

  assert.equal(verify("export const value = 1;", "no-named-reexports").length, 0);
});

test("no-parent-reexports rejects exports from parent directories", () => {
  assert.equal(verify('export { value } from "../value";', "no-parent-reexports").length, 1);

  assert.equal(verify('export { value } from "./value";', "no-parent-reexports").length, 0);
});

test("no-sql-outside-repository restricts SQL.js to the repository adapter", () => {
  assert.equal(
    verify(
      'import initSqlJs from "sql.js";',
      "no-sql-outside-repository",
      "packages/pkg-application/src/query.ts",
    ).length,
    1,
  );

  assert.equal(
    verify(
      'import initSqlJs from "sql.js";',
      "no-sql-outside-repository",
      "packages/pkg-adapter-data-v1/src/adapters/content/sqljs/sql-js-content.repository.ts",
    ).length,
    0,
  );
});

test("execute-single-parameter accepts one input and rejects multiple inputs", () => {
  assert.equal(
    verify("class Handler { execute(input: Input): void {} }", "execute-single-parameter").length,
    0,
  );

  assert.equal(
    verify("interface Port { execute(input: Input): void; }", "execute-single-parameter").length,
    0,
  );

  assert.equal(
    verify(
      "class Handler { execute(first: string, second: string): void {} }",
      "execute-single-parameter",
    ).length,
    1,
  );

  assert.equal(
    verify(
      'class Adapter { execute(...args: Parameters<Port["execute"]>): void {} }',
      "execute-single-parameter",
    ).length,
    1,
  );
});

test("suppression rule rejects unjustified suppressions", () => {
  assert.equal(verify("// @ts-ignore\nconst value = 1;", "no-unjustified-suppression").length, 1);

  assert.equal(
    verify(
      "// @ts-expect-error -- legacy declaration\nconst value = 1;",
      "no-unjustified-suppression",
    ).length,
    0,
  );
});

test("no-complex-inline-handler rejects control flow", () => {
  assert.equal(
    verify("<Button onClick={() => { if (ready) submit(); }} />;", "no-complex-inline-handler")
      .length,
    1,
  );
});

test("one-function-per-file counts only top-level implementations", () => {
  assert.equal(
    verify(
      "function createValue() { function normalizeValue() { return 1; } return normalizeValue(); }",
      "one-function-per-file",
    ).length,
    0,
  );

  assert.equal(
    verify(
      "function createValue() { return 1; } function readValue() { return 2; }",
      "one-function-per-file",
    ).length,
    1,
  );
});

test("no-aggregated-adapters rejects plural adapter files and multiple classes", () => {
  assert.doesNotThrow(() =>
    runRuleCases("no-aggregated-adapters", architecture.rules["no-aggregated-adapters"], {
      valid: [
        {
          code: "export class FirstAdapter {}",
          filename: resolve(
            process.cwd(),
            "packages/pkg-adapter-data-v1/src/adapters/progress/first.adapter.ts",
          ),
        },
      ],
      invalid: [
        {
          code: "export class FirstAdapter {} export class SecondAdapter {}",
          filename: resolve(
            process.cwd(),
            "packages/pkg-adapter-data-v1/src/adapters/progress/first.adapter.ts",
          ),
          errors: [{ messageId: "multipleClasses" }],
        },
        {
          code: "export class FirstAdapter {}",
          filename: resolve(
            process.cwd(),
            "packages/pkg-adapter-data-v1/src/adapters/progress/progress.adapters.ts",
          ),
          errors: [{ messageId: "pluralFile" }],
        },
      ],
    }),
  );
});

test("cqrs-file-contract accepts granular command and query files", () => {
  assert.doesNotThrow(() =>
    runRuleCases("cqrs-file-contract", architecture.rules["cqrs-file-contract"], {
      valid: [
        {
          code: "export type CreateLessonCommand = { title: string };",
          filename: resolve(
            process.cwd(),
            "packages/pkg-application/src/commands/create-lesson.command.ts",
          ),
        },
        {
          code: "export class CreateLessonCommandHandler { execute() {} }",
          filename: resolve(
            process.cwd(),
            "packages/pkg-application/src/commands/create-lesson.command-handler.ts",
          ),
        },
        {
          code: "export type CreateLessonCommandResult = { id: string };",
          filename: resolve(
            process.cwd(),
            "packages/pkg-application/src/commands/create-lesson.command-result.ts",
          ),
        },
        {
          code: "export interface GetLessonQuery { key: string }",
          filename: resolve(
            process.cwd(),
            "packages/pkg-application/src/queries/get-lesson.query.ts",
          ),
        },
        {
          code: "export class GetLessonQueryHandler { execute() {} }",
          filename: resolve(
            process.cwd(),
            "packages/pkg-application/src/queries/get-lesson.query-handler.ts",
          ),
        },
        {
          code: "export type GetLessonQueryResult = { title: string }",
          filename: resolve(
            process.cwd(),
            "packages/pkg-application/src/queries/get-lesson.query-result.ts",
          ),
        },
      ],
      invalid: [],
    }),
  );
});

test("cqrs-file-contract rejects legacy use cases and incomplete handlers", () => {
  assert.doesNotThrow(() =>
    runRuleCases("cqrs-file-contract-invalid", architecture.rules["cqrs-file-contract"], {
      valid: [],
      invalid: [
        {
          code: "export class GetLessonUseCase { execute() {} }",
          filename: resolve(
            process.cwd(),
            "packages/pkg-application/src/use-cases/get-lesson.use-case.ts",
          ),
          errors: [{ messageId: "legacyUseCase" }],
        },
        {
          code: "export class GetLessonQueryHandler {}",
          filename: resolve(
            process.cwd(),
            "packages/pkg-application/src/queries/get-lesson.query-handler.ts",
          ),
          errors: [{ messageId: "missingExecute" }],
        },
      ],
    }),
  );
});

test("one-exported-function-per-file enforces one exported top-level function", () => {
  assert.doesNotThrow(() =>
    runRuleCases(
      "one-exported-function-per-file",
      architecture.rules["one-exported-function-per-file"],
      {
        valid: [
          {
            code: "export function createValue() { return 1; }",
            filename: resolve(process.cwd(), "packages/pkg-domain/src/create-value.ts"),
          },
          {
            code: "const createValue = () => 1; export { createValue };",
            filename: resolve(process.cwd(), "packages/pkg-domain/src/create-value.ts"),
          },
          {
            code: "export function createValue() { function normalizeValue() { return 1; } return normalizeValue(); }",
            filename: resolve(process.cwd(), "packages/pkg-domain/src/create-value.ts"),
          },
          {
            code: "const handlers = { run() { return 1; } }; [1].map(() => 1);",
            filename: resolve(process.cwd(), "packages/pkg-domain/src/handlers.type.ts"),
          },
          {
            code: "export default function createValue() { return 1; }",
            filename: resolve(process.cwd(), "packages/pkg-domain/src/create-value.ts"),
          },
        ],
        invalid: [
          {
            code: "export function createValue() { return 1; } export function readValue() { return 2; }",
            filename: resolve(process.cwd(), "packages/pkg-domain/src/values.ts"),
            errors: [{ messageId: "multipleFunctions" }],
          },
          {
            code: "function createValue() { return 1; }",
            filename: resolve(process.cwd(), "packages/pkg-domain/src/create-value.ts"),
            errors: [{ messageId: "notExported" }],
            output: "export function createValue() { return 1; }",
          },
          {
            code: "export function createValue() { return 1; } function readValue() { return 2; }",
            filename: resolve(process.cwd(), "packages/pkg-domain/src/values.ts"),
            errors: [{ messageId: "multipleFunctions" }, { messageId: "notExported" }],
            output:
              "export function createValue() { return 1; } export function readValue() { return 2; }",
          },
          {
            code: "const createValue = () => 1;",
            filename: resolve(process.cwd(), "packages/pkg-domain/src/create-value.ts"),
            errors: [{ messageId: "notExported" }],
            output: "export const createValue = () => 1;",
          },
        ],
      },
    ),
  );
});

test("one-interface-per-file rejects multiple interfaces in a package file", () => {
  assert.doesNotThrow(() =>
    runRuleCases("one-interface-per-file", architecture.rules["one-interface-per-file"], {
      valid: [
        {
          code: "export interface Lesson { title: string }",
          filename: resolve(process.cwd(), "packages/pkg-domain/src/lesson.ts"),
        },
      ],
      invalid: [
        {
          code: "export interface Lesson { title: string } export interface Topic { title: string }",
          filename: resolve(process.cwd(), "packages/pkg-domain/src/content.ts"),
          errors: [{ messageId: "multipleInterfaces" }],
        },
      ],
    }),
  );
});

test("one-type-per-file rejects multiple type aliases in a package file", () => {
  assert.doesNotThrow(() =>
    runRuleCases("one-type-per-file", architecture.rules["one-type-per-file"], {
      valid: [
        {
          code: "export type LessonId = string;",
          filename: resolve(process.cwd(), "packages/pkg-domain/src/lesson-id.ts"),
        },
      ],
      invalid: [
        {
          code: "export type LessonId = string; export type TopicId = string;",
          filename: resolve(process.cwd(), "packages/pkg-domain/src/content-ids.ts"),
          errors: [{ messageId: "multipleTypes" }],
        },
      ],
    }),
  );
});

test("domain-function-purity rejects external state and parameter mutation", () => {
  assert.doesNotThrow(() =>
    runRuleCases("domain-function-purity", architecture.rules["domain-function-purity"], {
      valid: [
        {
          code: "export function add(left: number, right: number) { return left + right; }",
          filename: resolve(process.cwd(), "packages/pkg-domain/src/add.ts"),
        },
      ],
      invalid: [
        {
          code: "export function today() { return new Date(); }",
          filename: resolve(process.cwd(), "packages/pkg-domain/src/today.ts"),
          errors: [{ messageId: "externalState" }],
        },
        {
          code: "export function increment(value: number) { value += 1; return value; }",
          filename: resolve(process.cwd(), "packages/pkg-domain/src/increment.ts"),
          errors: [{ messageId: "parameterMutation" }],
        },
      ],
    }),
  );
});

test("domain-functions-in-domain-package rejects domain logic in adapters", () => {
  assert.doesNotThrow(() =>
    runRuleCases(
      "domain-functions-in-domain-package",
      architecture.rules["domain-functions-in-domain-package"],
      {
        valid: [],
        invalid: [
          {
            code: "export function calculateMastery() { return 1; }",
            filename: resolve(
              process.cwd(),
              "packages/pkg-adapter-data-v1/src/study/study.service.ts",
            ),
            errors: [{ messageId: "misplaced" }],
          },
        ],
      },
    ),
  );
});

test("utils-module-boundary rejects domain dependencies", () => {
  assert.doesNotThrow(() =>
    runRuleCases("utils-module-boundary", architecture.rules["utils-module-boundary"], {
      valid: [
        {
          code: "export function clamp(value: number) { return value; }",
          filename: resolve(process.cwd(), "packages/pkg-utils/src/clamp.ts"),
        },
      ],
      invalid: [
        {
          code: "import { Topic } from \"@guesant/saberes-domain\"; export function readTopic() { return 'Topic'; }",
          filename: resolve(process.cwd(), "packages/pkg-utils/src/read-topic.ts"),
          errors: [{ messageId: "domainImport" }],
        },
      ],
    }),
  );
});

test("purposeful-naming enforces names that match the symbol responsibility", () => {
  assert.doesNotThrow(() =>
    runRuleCases("purposeful-naming", architecture.rules["purposeful-naming"], {
      valid: [
        {
          code: "export function calculateValue() { return 1; }",
          filename: resolve(process.cwd(), "packages/pkg-domain/src/calculate-value.ts"),
        },
        {
          code: "export function CourseView() { return <div />; }",
          filename: resolve(process.cwd(), "packages/app/src/course-view.component.tsx"),
        },
        {
          code: "export function useCourseViewModel() { return null; }",
          filename: resolve(process.cwd(), "packages/app/src/course.view-model.ts"),
        },
        {
          code: "export class DateFnsClockAdapter {}",
          filename: resolve(
            process.cwd(),
            "packages/pkg-adapter-data-v1/src/adapters/platform/date-fns-clock.adapter.ts",
          ),
        },
        {
          code: "export interface SaveLessonProgressPort { execute(): void; }",
          filename: resolve(process.cwd(), "packages/pkg-application/src/application.ports.ts"),
        },
      ],
      invalid: [
        {
          code: "export function dateKey() { const label = 'today'; return \"today\"; }",
          filename: resolve(process.cwd(), "packages/pkg-domain/src/date-key.ts"),
          errors: [{ messageId: "functionPurpose" }],
        },
        {
          code: "export function courseView() { return <div />; }",
          filename: resolve(process.cwd(), "packages/app/src/course-view.component.tsx"),
          errors: [{ messageId: "componentCase" }],
        },
        {
          code: "export function getCourseViewModel() { return null; }",
          filename: resolve(process.cwd(), "packages/app/src/course.view-model.ts"),
          errors: [{ messageId: "viewModelName" }],
        },
        {
          code: "export class DateFnsClock {}",
          filename: resolve(
            process.cwd(),
            "packages/pkg-adapter-data-v1/src/adapters/platform/date-fns-clock.adapter.ts",
          ),
          errors: [{ messageId: "classSuffix" }],
        },
        {
          code: "export interface SaveLessonProgress { execute(): void; }",
          filename: resolve(process.cwd(), "packages/pkg-application/src/application.ports.ts"),
          errors: [{ messageId: "contractSuffix" }],
        },
      ],
    }),
  );
});

test("layer-boundaries enforces the dependency direction across packages and import forms", () => {
  assert.equal(
    verify(
      'import type { Course } from "@guesant/saberes-domain";',
      "layer-boundaries",
      "packages/pkg-application/src/queries/get-course.query.ts",
    ).length,
    0,
  );

  assert.equal(
    verify(
      'import type { Course } from "@guesant/saberes-domain";',
      "layer-boundaries",
      "packages/app/src/features/catalog/catalog.component.tsx",
    ).length,
    1,
  );

  assert.equal(
    verify(
      'export * from "@guesant/saberes-adapter-data-v1";',
      "layer-boundaries",
      "packages/app/src/features/catalog/catalog.component.tsx",
    ).length,
    1,
  );

  assert.equal(
    verify(
      'const load = () => import("@guesant/saberes-domain");',
      "layer-boundaries",
      "packages/app/src/features/catalog/catalog.component.tsx",
    ).length,
    1,
  );

  assert.equal(
    verify(
      'const load = () => import("@guesant/saberes-domain");',
      "layer-boundaries",
      "packages/pkg-ui-content/src/content-renderer.tsx",
    ).length,
    1,
  );

  assert.equal(
    verify(
      'const adapter = require("@guesant/saberes-adapter-data-v1");',
      "layer-boundaries",
      "packages/pkg-application/src/application.ts",
    ).length,
    1,
  );

  assert.equal(
    verify(
      'import Adapter from "@guesant/saberes-adapter-data-v1";',
      "layer-boundaries",
      "packages/app/src/composition/create-application.ts",
    ).length,
    0,
  );

  assert.equal(
    verify(
      'import architecture from "../packages/pkg-tooling-eslint/src/architecture.plugin.mjs";',
      "layer-boundaries",
      ".config/eslint.config.mjs",
    ).length,
    0,
  );
});

test("layer-boundaries accepts and rejects the declared package matrix", () => {
  const allowed = [
    ["packages/pkg-domain/src/value.ts", "@guesant/saberes-domain"],
    ["packages/pkg-application/src/application.ts", "@guesant/saberes-domain"],
    [
      "packages/pkg-application/src/commands/load.command.ts",
      "@guesant/saberes-application/models",
    ],
    ["packages/pkg-application/src/queries/load.query.ts", "@guesant/saberes-application/ports"],
    ["packages/pkg-application/src/ports/load.port.ts", "@guesant/saberes-domain"],
    ["packages/pkg-adapter-data-v1/src/load.adapter.ts", "@guesant/saberes-application"],
    ["packages/pkg-ui/src/button.component.tsx", "@guesant/saberes-ui"],
    ["packages/pkg-ui-content/src/content.component.tsx", "@guesant/saberes-ui"],
    ["packages/app/src/composition/create.ts", "@guesant/saberes-adapter-data-v1"],
    ["packages/app/src/features/catalog/catalog.component.tsx", "@guesant/saberes-ui"],
  ];

  for (const [filename, source] of allowed) {
    assert.equal(verify(`import value from "${source}";`, "layer-boundaries", filename).length, 0);
  }

  const forbidden = [
    ["packages/pkg-domain/src/value.ts", "@guesant/saberes-application"],
    ["packages/pkg-application/src/application.ts", "@guesant/saberes-adapter-data-v1"],
    [
      "packages/pkg-application/src/commands/load.command.ts",
      "@guesant/saberes-application/queries",
    ],
    ["packages/pkg-application/src/queries/load.query.ts", "@guesant/saberes-application/commands"],
    ["packages/pkg-application/src/ports/load.port.ts", "@guesant/saberes-adapter-data-v1"],
    ["packages/pkg-ui/src/button.component.tsx", "@guesant/saberes-application"],
    ["packages/pkg-ui-content/src/content.component.tsx", "@guesant/saberes-domain"],
    ["packages/app/src/features/catalog/catalog.component.tsx", "@guesant/saberes-domain"],
    ["packages/app/src/features/catalog/catalog.component.tsx", "@guesant/saberes-adapter-data-v1"],
  ];

  for (const [filename, source] of forbidden) {
    assert.equal(
      verify(`import value from "${source}";`, "layer-boundaries", filename).length,
      1,
      `${filename} must reject ${source}`,
    );
  }
});

test("no-low-level-layout-outside-ui rejects layout primitives and props in app", () => {
  assert.equal(
    verify(
      'import { Box } from "@guesant/saberes-ui"; function View(props: ViewProps) { return <Box sx={{ gap: 1 }}>{props.children}</Box>; }',
      "no-low-level-layout-outside-ui",
      "packages/app/src/features/catalog/view.component.tsx",
    ).length,
    2,
  );

  assert.equal(
    verify(
      'import { Box } from "@guesant/saberes-ui"; function View(props: ViewProps) { return <Box sx={{ gap: 1 }}>{props.children}</Box>; }',
      "no-low-level-layout-outside-ui",
      "packages/pkg-ui/src/content-group.component.tsx",
    ).length,
    0,
  );
});

test("purity rules reject technology imports in domain and application", () => {
  assert.equal(
    verify('import React from "react";', "domain-purity", "packages/pkg-domain/src/domain.ts")
      .length,
    1,
  );

  assert.equal(
    verify(
      'const database = require("dexie");',
      "application-purity",
      "packages/pkg-application/src/application.ts",
    ).length,
    1,
  );

  assert.equal(
    verify(
      'import { format } from "date-fns";',
      "domain-purity",
      "packages/pkg-domain/src/domain.ts",
    ).length,
    0,
  );
});

test("composition and adapter rules isolate concrete implementations", () => {
  assert.equal(
    verify(
      'import { SqlJsGetCourseAdapter } from "@guesant/saberes-adapter-data-v1"; new SqlJsGetCourseAdapter();',
      "composition-root",
      "packages/app/src/composition/create-application.ts",
    ).length,
    0,
  );

  assert.equal(
    verify(
      'import { SqlJsGetCourseAdapter } from "@guesant/saberes-adapter-data-v1"; new SqlJsGetCourseAdapter();',
      "composition-root",
      "packages/app/src/features/catalog/catalog.component.tsx",
    ).length,
    2,
  );

  assert.equal(
    verify(
      'import { GraphologyBuildKnowledgeGraphAdapter } from "@guesant/saberes-adapter-graphology-v1";',
      "no-adapter-cross-import",
      "packages/pkg-adapter-data-v1/src/adapters/content.adapter.ts",
    ).length,
    1,
  );
});

test("adapter-dependency-injection rejects constructor instantiation", () => {
  assert.equal(
    verify(
      "export class LoadCourseAdapter { constructor(private readonly store = new CourseStore()) {} }",
      "adapter-dependency-injection",
      "packages/pkg-adapter-data-v1/src/load-course.adapter.ts",
    ).length,
    1,
  );

  assert.equal(
    verify(
      "export class LoadCourseAdapter { constructor(private readonly store: CourseStore) {} }",
      "adapter-dependency-injection",
      "packages/pkg-adapter-data-v1/src/load-course.adapter.ts",
    ).length,
    0,
  );
});

test("constructor-dependency-inversion rejects concrete constructor dependencies", () => {
  assert.equal(
    verify(
      'import { CourseRepository } from "@guesant/saberes-adapter-data-v1"; export class CourseService { constructor(private readonly repository: CourseRepository) {} }',
      "constructor-dependency-inversion",
      "packages/app/src/features/courses/course.service.ts",
    ).length,
    1,
  );

  assert.equal(
    verify(
      'import type { CourseRepositoryContract } from "@guesant/saberes-adapter-data-v1"; export class CourseService { constructor(private readonly repository: CourseRepositoryContract) {} }',
      "constructor-dependency-inversion",
      "packages/app/src/features/courses/course.service.ts",
    ).length,
    0,
  );

  assert.equal(
    verify(
      "export class CourseService { constructor() { this.repository = new CourseRepository(); } }",
      "constructor-dependency-inversion",
      "packages/app/src/features/courses/course.service.ts",
    ).length,
    1,
  );
});

test("CQRS, MVVM, port and adapter rules enforce their file contracts", () => {
  assert.equal(
    verify(
      'import type { FindCourseQuery } from "../queries/find-course.query";',
      "cqrs-layer-boundaries",
      "packages/pkg-application/src/commands/load-course.command.ts",
    ).length,
    1,
  );

  assert.equal(
    verify(
      'import type { SaveCourseCommand } from "../commands/save-course.command";',
      "cqrs-layer-boundaries",
      "packages/pkg-application/src/queries/list-courses.query.ts",
    ).length,
    1,
  );

  assert.equal(
    verify(
      'import type { LoadCourseHandler } from "../commands/load-course.handler";',
      "cqrs-layer-boundaries",
      "packages/pkg-application/src/ports/load-course.port.ts",
    ).length,
    1,
  );

  assert.equal(
    verify(
      'import Card from "../components/card.component";',
      "mvvm-layer-boundaries",
      "packages/app/src/features/catalog/catalog.view-model.ts",
    ).length,
    1,
  );

  assert.equal(
    verify(
      "export interface LoadCoursePort { execute(input: string): Promise<string>; }",
      "port-contract",
      "packages/pkg-application/src/ports/load-course.port.ts",
    ).length,
    0,
  );

  assert.equal(
    verify(
      "export interface LoadCourse { load(input: string): Promise<string>; }",
      "port-contract",
      "packages/pkg-application/src/ports/load-course.port.ts",
    ).length,
    1,
  );

  assert.equal(
    verify(
      "export class LoadCourseAdapter implements LoadCoursePort { execute(input: string) { return input; } }",
      "adapter-contract",
      "packages/pkg-adapter-data-v1/src/load-course.adapter.ts",
    ).length,
    0,
  );

  assert.equal(
    verify(
      "export class LoadCourseAdapter implements LoadCoursePort, OtherPort { execute(input: string) { return input; } }",
      "adapter-contract",
      "packages/pkg-adapter-data-v1/src/load-course.adapter.ts",
    ).length,
    1,
  );
});

test("file-name-contract enforces typed kebab-case suffixes", () => {
  assert.equal(
    verify(
      "export type CatalogFilters = { search?: string };",
      "file-name-contract",
      "packages/pkg-application/src/models/catalog-filters.type.ts",
    ).length,
    0,
  );

  assert.equal(
    verify(
      "export type CatalogFilters = { search?: string };",
      "file-name-contract",
      "packages/pkg-application/src/models/CatalogFilters.ts",
    ).length,
    1,
  );

  assert.equal(
    verify(
      "export type CatalogFilters = { search?: string };",
      "file-name-contract",
      "packages/pkg-application/src/models/catalog-filters.ts",
    ).length,
    1,
  );

  assert.equal(
    verify(
      "import type { Props } from './props.type'; export function Card(props: Props) { return <span />; }",
      "file-name-contract",
      "packages/pkg-ui/src/card.component.tsx",
    ).length,
    0,
  );

  assert.equal(
    verify(
      "describe('Card', () => { it('renders', () => {}); });",
      "file-name-contract",
      "packages/pkg-ui/src/card.component.test.tsx",
    ).length,
    0,
  );
});

test("file-kind-location restricts file kinds to their layers", () => {
  assert.equal(
    verify(
      "export function calculateScore() { return 1; }",
      "file-kind-location",
      "packages/pkg-domain/src/study/calculate-score.function.ts",
    ).length,
    0,
  );

  assert.equal(
    verify(
      "export function calculateScore() { return 1; }",
      "file-kind-location",
      "packages/app/src/features/catalog/calculate-score.function.ts",
    ).length,
    0,
  );

  assert.equal(
    verify(
      "export interface GetCoursePort { execute(input: string): Promise<string>; }",
      "file-kind-location",
      "packages/pkg-application/src/ports/get-course-port.port.ts",
    ).length,
    0,
  );
});

test("file-kind-contract enforces principal declarations and names", () => {
  assert.equal(
    verify(
      "export type GetCourseQuery = { slug: string };",
      "file-kind-contract",
      "packages/pkg-application/src/queries/get-course.query.ts",
    ).length,
    0,
  );

  assert.equal(
    verify(
      "export type OtherQuery = { slug: string };",
      "file-kind-contract",
      "packages/pkg-application/src/queries/get-course.query.ts",
    ).length,
    1,
  );

  assert.equal(
    verify(
      "export type First = string; export type Second = number;",
      "file-kind-contract",
      "packages/pkg-domain/src/models/value.type.ts",
    ).length,
    1,
  );

  assert.equal(
    verify(
      "export function Card(props: CardProps) { return <span />; }",
      "file-kind-contract",
      "packages/pkg-ui/src/card.component.tsx",
    ).length,
    0,
  );
});

test("file-kind-contract keeps ports, adapters and barrels explicit", () => {
  assert.equal(
    verify(
      "export interface GetCoursePort { execute(input: string): Promise<string>; }",
      "file-kind-contract",
      "packages/pkg-application/src/ports/get-course-port.port.ts",
    ).length,
    0,
  );

  assert.equal(
    verify(
      "export interface GetCoursePort { read(input: string): Promise<string>; }",
      "file-kind-contract",
      "packages/pkg-application/src/ports/get-course-port.port.ts",
    ).length,
    1,
  );

  assert.equal(
    verify(
      "export class GetCourseAdapter implements GetCoursePort { execute(input: string) { return input; } }",
      "file-kind-contract",
      "packages/pkg-adapter-data-v1/src/adapters/get-course.adapter.ts",
    ).length,
    0,
  );

  assert.equal(
    verify(
      'export * from "./button.component";',
      "file-kind-contract",
      "packages/pkg-ui/src/index.ts",
    ).length,
    0,
  );

  assert.equal(
    verify(
      'export { Button } from "./button.component";',
      "file-kind-contract",
      "packages/pkg-ui/src/index.ts",
    ).length,
    1,
  );
});

test("file-kind-contract leaves explicit configuration files to their config contract", () => {
  assert.equal(
    verify(
      "const base = '/'; export default { base };",
      "file-kind-contract",
      ".config/vite.config.ts",
    ).length,
    0,
  );
});

test("ui-component-prefix requires the UI prefix for public components and props", () => {
  assert.equal(
    verify(
      "export type UIButtonProps = { label: string }; export function UIButton(props: UIButtonProps) { return <button>{props.label}</button>; }",
      "ui-component-prefix",
      "packages/pkg-ui/src/button.component.tsx",
    ).length,
    0,
  );

  assert.equal(
    verify(
      "export type ButtonProps = { label: string }; export function Button(props: ButtonProps) { return <button>{props.label}</button>; }",
      "ui-component-prefix",
      "packages/pkg-ui/src/button.component.tsx",
    ).length,
    2,
  );

  assert.equal(
    verify(
      "export function createTheme() { return {}; }",
      "ui-component-prefix",
      "packages/pkg-ui/src/create-theme.function.ts",
    ).length,
    0,
  );
});
