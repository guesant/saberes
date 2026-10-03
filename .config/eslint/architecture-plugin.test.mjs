import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import test from "node:test";
import architecture from "./architecture-plugin.mjs";

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

function verify(code, rule, filename = "<input>.ts") {
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

function runRuleCases(name, rule, cases) {
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

test("wildcard-reexports-only allows wildcard exports only in index files", () => {
  assert.equal(
    verify('export * from "./value.ts";', "wildcard-reexports-only", "packages/pkg-ui/src/index.ts")
      .length,
    0,
  );

  assert.equal(
    verify(
      'export * from "./value.ts";',
      "wildcard-reexports-only",
      "packages/pkg-ui/src/button.component.tsx",
    ).length,
    1,
  );

  assert.equal(
    verify(
      'export { value } from "./value.ts";',
      "wildcard-reexports-only",
      "packages/pkg-ui/src/button.component.tsx",
    ).length,
    0,
  );
});

test("no-named-reexports rejects named re-exports", () => {
  assert.equal(verify('export { value } from "./value.ts";', "no-named-reexports").length, 1);

  assert.equal(verify("export const value = 1;", "no-named-reexports").length, 0);
});

test("no-parent-reexports rejects exports from parent directories", () => {
  assert.equal(verify('export { value } from "../value.ts";', "no-parent-reexports").length, 1);

  assert.equal(verify('export { value } from "./value.ts";', "no-parent-reexports").length, 0);
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
