import { dirname, resolve } from "node:path";

const workspacePackagePaths = new Map([
  ["@guesant/saberes-domain", "packages/pkg-domain"],
  ["@guesant/saberes-application", "packages/pkg-application"],
  ["@guesant/saberes-adapter-data-v1", "packages/pkg-adapter-data-v1"],
  ["@guesant/saberes-adapter-graphology-v1", "packages/pkg-adapter-graphology-v1"],
  ["@guesant/saberes-adapter-validation-v1", "packages/pkg-adapter-validation-v1"],
  ["@guesant/saberes-ui", "packages/pkg-ui"],
  ["@guesant/saberes-ui-content", "packages/pkg-ui-content"],
  ["@guesant/saberes-app", "packages/app"],
  ["@guesant/saberes-tooling", "packages/pkg-tooling"],
  ["@guesant/saberes-tooling-eslint", "packages/pkg-tooling-eslint"],
]);

const applicationLayers = new Set([
  "application",
  "application-commands",
  "application-queries",
  "application-ports",
]);

const forbiddenApplicationImports = [
  /^(?:react|react-dom)(?:\/|$)/,
  /^@(?:mui|emotion)\//,
  /^@tanstack\//,
  /^(?:dexie|sql\.js|fake-indexeddb|idb)(?:\/|$)/,
  /^(?:valibot|graphology|cytoscape|echarts|three|katex)(?:\/|$)/,
  /^(?:react-markdown|rehype-|remark-)/,
  /^(?:@fontsource|react-complex-tree)(?:\/|$)/,
  /^(?:node:)?(?:window|document|navigator|indexeddb|localstorage)$/i,
];

const forbiddenDomainImports = [
  ...forbiddenApplicationImports,
  /^(?:@guesant\/saberes-(?:application|adapter|ui|app))(?:\/|$)/,
  /^(?:@mui|@emotion|@tanstack)\//,
];

export function normalizeFilename(filename) {
  return filename.replaceAll("\\", "/");
}

export function getSourceLayer(filename) {
  const normalized = normalizeFilename(filename);

  if (normalized === "<input>.ts" || normalized.startsWith("<text")) {
    return undefined;
  }

  if (/\/packages\/pkg-domain\/(?:src|tests)\//.test(normalized)) {
    return "domain";
  }

  if (/\/packages\/pkg-application\/src\/commands(?:\/|$)/.test(normalized)) {
    return "application-commands";
  }

  if (/\/packages\/pkg-application\/src\/queries(?:\/|$)/.test(normalized)) {
    return "application-queries";
  }

  if (/\/packages\/pkg-application\/src\/ports(?:\/|$)/.test(normalized)) {
    return "application-ports";
  }

  if (/\/packages\/pkg-application\/(?:src|tests)\//.test(normalized)) {
    return "application";
  }

  if (/\/packages\/pkg-adapter-[^/]+\/(?:src|tests)\//.test(normalized)) {
    return "adapter";
  }

  if (/\/packages\/pkg-ui-content\/(?:src|tests)\//.test(normalized)) {
    return "ui-content";
  }

  if (/\/packages\/pkg-ui\/(?:src|tests)\//.test(normalized)) {
    return "ui";
  }

  if (/\/packages\/app\/src\/composition\//.test(normalized)) {
    return "app-composition";
  }

  if (/\/packages\/app\/(?:src|tests)\//.test(normalized)) {
    return "app-presentation";
  }

  if (/\/packages\/pkg-utils\/(?:src|tests)\//.test(normalized)) {
    return "utils";
  }

  if (/\/packages\/thedata\//.test(normalized)) {
    return "data";
  }

  if (/\/packages\/pkg-tooling(?:-eslint)?\/(?:src|tests)\//.test(normalized)) {
    return "tooling";
  }

  if (/(?:^|\/)\.local\/operator\//.test(normalized)) {
    return "tooling";
  }

  if (/(?:^|\/)\.config\//.test(normalized)) {
    return "config";
  }

  return undefined;
}

export function getPackagePathFromSpecifier(source) {
  for (const [specifier, packagePath] of workspacePackagePaths) {
    if (source === specifier || source.startsWith(`${specifier}/`)) {
      return packagePath;
    }
  }

  return undefined;
}

export function getAdapterPackageFromFilename(filename) {
  return normalizeFilename(filename)
    .match(/\/packages\/(pkg-adapter-[^/]+)\//)?.[1];
}

export function getAdapterPackageFromSource(filename, source) {
  const packagePath = getPackagePathFromSpecifier(source);

  if (packagePath) {
    return packagePath.split("/")
      .at(1)
      ?.startsWith("pkg-adapter-")
      ? packagePath.split("/")
        .at(1)
      : undefined;
  }

  if (source.startsWith(".")) {
    return getAdapterPackageFromFilename(getRelativeTargetFilename(filename, source));
  }

  return undefined;
}

export function isWorkspaceModuleSource(source) {
  return Boolean(getPackagePathFromSpecifier(source)) || source.startsWith("@guesant/saberes-");
}

export function isTestFilename(filename) {
  return /(?:\.test|\.spec)\.(?:js|jsx|mjs|ts|tsx)$/.test(filename);
}

export function isExternalModuleSource(source) {
  return !source.startsWith(".") && !isWorkspaceModuleSource(source);
}

export function getRelativeTargetFilename(filename, source) {
  if (!source.startsWith(".")) {
    return undefined;
  }

  return resolve(dirname(filename), source)
    .replaceAll("\\", "/");
}

export function getTargetLayer(filename, source) {
  for (const [specifier, packagePath] of workspacePackagePaths) {
    if (source === specifier || source.startsWith(`${specifier}/`)) {
      const internalPath = source.slice(specifier.length)
        .replace(/^\//, "");

      const targetPath = internalPath
        ? resolve(process.cwd(), packagePath, "src", internalPath)
        : resolve(process.cwd(), packagePath, "src/index.ts");

      return getSourceLayer(targetPath);
    }
  }

  if (source.startsWith("@guesant/saberes-")) {
    return "unknown-workspace";
  }

  if (source.startsWith(".")) {
    return getSourceLayer(getRelativeTargetFilename(filename, source));
  }

  return undefined;
}

export function getStaticModuleSource(node) {
  if (node?.type === "Literal" && typeof node.value === "string") {
    return node.value;
  }

  if (node?.type === "StringLiteral") {
    return node.value;
  }

  return undefined;
}

export function createModuleReferenceVisitors(context, visit) {
  const filename = normalizeFilename(context.getFilename());

  function inspect(node, sourceNode) {
    const source = getStaticModuleSource(sourceNode);

    if (source) {
      visit({
        context,
        filename,
        node,
        source,
        layer: getSourceLayer(filename),
        target: getTargetLayer(filename, source),
      });
    }
  }

  return {
    ImportDeclaration(node) {
      inspect(node, node.source);
    },
    ExportNamedDeclaration(node) {
      inspect(node, node.source);
    },
    ExportAllDeclaration(node) {
      inspect(node, node.source);
    },
    ImportExpression(node) {
      inspect(node, node.source);
    },
    CallExpression(node) {
      if (node.callee.type === "Identifier" && node.callee.name === "require") {
        inspect(node, node.arguments[0]);
      }
    },
    TSImportEqualsDeclaration(node) {
      inspect(node, node.moduleReference);
    },
  };
}

export function isJsx(node) {
  return Boolean(node && (node.type === "JSXElement" || node.type === "JSXFragment"));
}

export function containsJsx(node, sourceCode) {
  if (!node || typeof node !== "object") {
    return false;
  }

  if (isJsx(node)) {
    return true;
  }

  return (sourceCode.visitorKeys[node.type] || []).some((key) => {
    const value = node[key];

    return Array.isArray(value)
      ? value.some((child) => {
        return containsJsx(child, sourceCode);
      })
      : containsJsx(value, sourceCode);
  });
}

export function containsControlFlow(node, sourceCode) {
  if (!node || typeof node !== "object") {
    return false;
  }

  if (
    [
      "IfStatement",
      "ForStatement",
      "ForInStatement",
      "ForOfStatement",
      "WhileStatement",
      "DoWhileStatement",
      "SwitchStatement",
      "TryStatement",
    ].includes(node.type)
  ) {
    return true;
  }

  return (sourceCode.visitorKeys[node.type] || []).some((key) => {
    const value = node[key];

    return Array.isArray(value)
      ? value.some((child) => {
        return containsControlFlow(child, sourceCode);
      })
      : containsControlFlow(value, sourceCode);
  });
}

export function unwrapExpression(node) {
  let current = node;

  while (
    current &&
    [
      "ChainExpression",
      "ParenthesizedExpression",
      "TSAsExpression",
      "TSTypeAssertion",
      "TSNonNullExpression",
    ].includes(current.type)
  ) {
    current = current.expression;
  }

  return current;
}

export function getCallbackExpression(callback) {
  if (callback.type === "ArrowFunctionExpression" && callback.body.type !== "BlockStatement") {
    return unwrapExpression(callback.body);
  }

  if (callback.body?.type === "BlockStatement") {
    const statements = callback.body.body.filter((statement) => {
      return statement.type !== "EmptyStatement";
    });

    if (statements.length !== 1 || statements[0].type !== "ReturnStatement") {
      return undefined;
    }

    return unwrapExpression(statements[0].argument);
  }

  return undefined;
}

export function isImportedSelfClosingComponent(expression, importedBindings) {
  const node = unwrapExpression(expression);

  return Boolean(
    node?.type === "JSXElement" &&
    node.openingElement.selfClosing &&
    node.openingElement.name.type === "JSXIdentifier" &&
    /^[A-Z]/.test(node.openingElement.name.name) &&
    importedBindings.has(node.openingElement.name.name),
  );
}

export function isMapCall(node) {
  return (
    node.callee?.type === "MemberExpression" &&
    !node.callee.computed &&
    node.callee.property.type === "Identifier" &&
    node.callee.property.name === "map"
  );
}

export function collectImports(node) {
  const bindings = new Set();

  for (const specifier of node.specifiers) {
    bindings.add(specifier.local.name);
  }

  return bindings;
}

export function getComponentName(node) {
  if (node.type === "FunctionDeclaration") {
    return node.id?.name;
  }

  return node.parent?.type === "VariableDeclarator" && node.parent.id.type === "Identifier"
    ? node.parent.id.name
    : undefined;
}

const transparentFunctionParentTypes = new Set([
  "ChainExpression",
  "ParenthesizedExpression",
  "TSAsExpression",
  "TSTypeAssertion",
  "TSNonNullExpression",
]);

export function getFunctionVariableDeclarator(node) {
  let { parent } = node;

  while (parent && transparentFunctionParentTypes.has(parent.type)) {
    parent = parent.parent;
  }

  return parent?.type === "VariableDeclarator" ? parent : undefined;
}

export function isTopLevel(node) {
  let current = node.parent;

  while (
    current &&
    [
      "ExportNamedDeclaration",
      "ExportDefaultDeclaration",
      "VariableDeclarator",
      "VariableDeclaration",
      ...transparentFunctionParentTypes,
    ].includes(current.type)
  ) {
    current = current.parent;
  }

  return current?.type === "Program";
}

export function isTopLevelFunction(node) {
  return (
    ["FunctionDeclaration", "FunctionExpression", "ArrowFunctionExpression"].includes(node.type) &&
    isTopLevel(node)
  );
}

export function getExportedBindings(program) {
  const bindings = new Set();

  for (const statement of program.body) {
    if (statement.type === "ExportDefaultDeclaration") {
      const { declaration } = statement;

      if (declaration.type === "Identifier") {
        bindings.add(declaration.name);
      } else if (declaration.id?.name) {
        bindings.add(declaration.id.name);
      }

      continue;
    }

    if (statement.type !== "ExportNamedDeclaration") {
      continue;
    }

    const { declaration } = statement;

    if (declaration) {
      if (declaration.type === "VariableDeclaration") {
        for (const variable of declaration.declarations) {
          if (variable.id.type === "Identifier") {
            bindings.add(variable.id.name);
          }
        }
      } else if (declaration.id?.name) {
        bindings.add(declaration.id.name);
      }
    }

    for (const specifier of statement.specifiers) {
      if (specifier.local?.name) {
        bindings.add(specifier.local.name);
      }
    }
  }

  return bindings;
}

export function isExportedFunction(node, program) {
  let current = node;

  while (current) {
    if (["ExportNamedDeclaration", "ExportDefaultDeclaration"].includes(current.type)) {
      return true;
    }

    if (
      ![
        "FunctionDeclaration",
        "FunctionExpression",
        "ArrowFunctionExpression",
        "VariableDeclarator",
        "VariableDeclaration",
        ...transparentFunctionParentTypes,
      ].includes(current.type)
    ) {
      break;
    }

    current = current.parent;
  }

  const name = getFunctionDeclarationName(node);

  return Boolean(name && getExportedBindings(program)
    .has(name));
}

export function shouldIgnoreFunctionPolicy(filename) {
  return (
    !filename.includes("/packages/") ||
    /(?:\.test|\.spec|\.config|\.setup|\.tool|\.operator)\.(?:ts|tsx)$/.test(filename) ||
    /\/index\.(?:ts|tsx)$/.test(filename) ||
    /\.d\.ts$/.test(filename)
  );
}

export function getFunctionDeclarationName(node) {
  if (node.type === "FunctionDeclaration") {
    return node.id?.name;
  }

  const declarator = getFunctionVariableDeclarator(node);

  return declarator?.id.type === "Identifier" ? declarator.id.name : undefined;
}

export function startsWithPurposeVerb(name) {
  const verbs = [
    "act",
    "action",
    "add",
    "archive",
    "build",
    "calculate",
    "check",
    "clear",
    "close",
    "complete",
    "compute",
    "create",
    "delete",
    "define",
    "derive",
    "enroll",
    "execute",
    "export",
    "fetch",
    "filter",
    "find",
    "format",
    "grade",
    "generate",
    "get",
    "handle",
    "has",
    "is",
    "can",
    "collect",
    "contains",
    "import",
    "inspect",
    "increment",
    "list",
    "load",
    "map",
    "matches",
    "move",
    "normalize",
    "open",
    "parse",
    "pause",
    "preview",
    "read",
    "recommend",
    "record",
    "report",
    "reduce",
    "register",
    "reload",
    "remove",
    "render",
    "replace",
    "resolve",
    "restore",
    "revive",
    "run",
    "save",
    "schedule",
    "select",
    "serialize",
    "set",
    "should",
    "start",
    "starts",
    "split",
    "resume",
    "swap",
    "stop",
    "submit",
    "suggest",
    "sync",
    "transform",
    "toggle",
    "convert",
    "current",
    "unwrap",
    "update",
    "use",
    "validate",
    "verify",
    "write",
  ];

  return verbs.some((verb) => {
    return name === verb || (name.startsWith(verb) && /^[A-Z]/.test(name.slice(verb.length)));
  });
}

export function getClassSuffix(filename) {
  if (/\.(?:adapter|adapters)\.ts$/.test(filename)) {
    return "Adapter";
  }

  if (/\.store\.ts$/.test(filename)) {
    return "Store";
  }

  if (/\.service\.ts$/.test(filename)) {
    return "Service";
  }

  if (/\.(?:command-handler|query-handler)\.ts$/.test(filename)) {
    return "Handler";
  }

  if (/\.database\.ts$/.test(filename)) {
    return "Database";
  }

  return undefined;
}

export function getContractSuffix(filename) {
  if (/\.ports?\.ts$/.test(filename)) {
    return ["Port", "Ports"];
  }

  if (/\.command\.ts$/.test(filename)) {
    return ["Command"];
  }

  if (/\.query\.ts$/.test(filename)) {
    return ["Query"];
  }

  if (/\.(?:command|query)-result\.ts$/.test(filename)) {
    return ["Result"];
  }

  return [];
}

const fileKinds = new Set([
  "adapter",
  "command",
  "command-handler",
  "command-result",
  "component",
  "contract",
  "composition",
  "config",
  "database",
  "declaration",
  "enum",
  "enums",
  "function",
  "hook",
  "interface",
  "locale",
  "model",
  "operator",
  "plugin",
  "port",
  "ports",
  "query",
  "query-handler",
  "query-result",
  "repository",
  "schema",
  "service",
  "services",
  "setup",
  "spec",
  "storage",
  "store",
  "styles",
  "test",
  "test-support",
  "tool",
  "type",
  "view-model",
]);

const fileKindAliases = new Map([
  ["d", "declaration"],
  ["spec", "spec"],
  ["test", "test"],
  ["test-support", "test-support"],
]);

export function getFileDescriptor(filename) {
  const normalized = normalizeFilename(filename);

  const basename = normalized.split("/")
    .at(-1) || "";

  if (/^index\.(?:js|jsx|mjs|ts|tsx)$/.test(basename)) {
    return { basename, extension: basename.split(".")
      .at(-1), kind: "index", stem: "index" };
  }

  if (/\.d\.ts$/.test(basename)) {
    return {
      basename,
      extension: "ts",
      kind: "declaration",
      stem: basename.slice(0, -5),
    };
  }

  const match = basename.match(/^(.*)\.([a-z0-9-]+)\.(js|jsx|mjs|ts|tsx)$/);

  if (!match) {
    return { basename, extension: basename.split(".")
      .at(-1), kind: undefined, stem: basename };
  }

  const [, stem, rawKind, extension] = match;

  const kind = fileKindAliases.get(rawKind) || rawKind;

  return { basename, extension, kind, stem };
}

export function isSmallKebabCase(value) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

export function getFileStemParts(descriptor) {
  return descriptor.stem.split(".")
    .filter(Boolean);
}

export function getFileStemName(descriptor) {
  const parts = getFileStemParts(descriptor);

  return parts.at(-1) === "index" ? parts.slice(0, -1)
    .join("-") : parts.join("-");
}

export function getFileNamePascalCase(descriptor) {
  return toPascalCase(getFileStemName(descriptor));
}

export function getFileNameCamelCase(descriptor) {
  const pascal = getFileNamePascalCase(descriptor);

  return pascal ? `${pascal[0].toLowerCase()}${pascal.slice(1)}` : pascal;
}

export function getFileBaseForContract(descriptor) {
  return getFileStemName(descriptor);
}

export function isFileLocationAllowed(filename, kind) {
  const normalized = normalizeFilename(filename);

  if (kind === "index" || kind === "test" || kind === "spec" || kind === "test-support") {
    return /\/packages\/|(?:^|\/)\.local\/operator\//.test(normalized);
  }

  if (kind === "declaration") {
    return /\/packages\//.test(normalized);
  }

  if (kind === "config") {
    return /(?:^|\/)\.config\/|\/packages\/(?:app|pkg-ui)\/src\//.test(normalized);
  }

  if (kind === "operator") {
    return /(?:^|\/)\.local\/operator\//.test(normalized);
  }

  if (kind === "tool" || kind === "plugin") {
    return /\/packages\/pkg-tooling(?:-eslint)?\/|(?:^|\/)\.local\/operator\//.test(normalized);
  }

  if (kind === "component") {
    return /\/packages\/(?:pkg-ui|pkg-ui-content|app)\//.test(normalized);
  }

  if (kind === "contract") {
    return /\/packages\/pkg-adapter-[^/]+\/(?:src|tests)\//.test(normalized);
  }

  if (kind === "styles") {
    return /\/packages\/pkg-ui(?:-content)?\//.test(normalized);
  }

  if (kind === "view-model" || kind === "hook" || kind === "locale") {
    return /\/packages\/app\/(?:src|tests)\//.test(normalized);
  }

  if (kind === "composition") {
    return /\/packages\/app\/src\/composition\//.test(normalized);
  }

  if (["command", "command-handler", "command-result"].includes(kind)) {
    return /\/packages\/pkg-application\/src\/commands\//.test(normalized);
  }

  if (["query", "query-handler", "query-result"].includes(kind)) {
    return /\/packages\/pkg-application\/src\/queries\//.test(normalized);
  }

  if (kind === "port") {
    return /\/packages\/pkg-application\/src\/ports\//.test(normalized);
  }

  if (kind === "ports" || kind === "services") {
    return /\/packages\/pkg-application\/src\//.test(normalized);
  }

  if (kind === "enums") {
    return /\/packages\/pkg-domain\/src\/models\//.test(normalized);
  }

  if (
    ["adapter", "repository", "database", "storage", "store", "service", "schema"].includes(kind)
  ) {
    return /\/packages\/pkg-adapter-[^/]+\/(?:src|tests)\//.test(normalized);
  }

  if (kind === "function") {
    return /\/packages\/(?:pkg-domain|pkg-application|pkg-adapter-[^/]+|pkg-utils|pkg-ui|pkg-ui-content|app|pkg-tooling(?:-eslint)?)\/(?:src|tests)\//.test(
      normalized,
    );
  }

  if (["interface", "type", "enum"].includes(kind)) {
    return /\/packages\/(?:pkg-domain|pkg-application|pkg-adapter-[^/]+|pkg-utils|app|pkg-ui|pkg-ui-content)\/(?:src|tests)\//.test(
      normalized,
    );
  }

  if (kind === "model") {
    return /\/packages\/(?:pkg-domain|pkg-application)\/(?:src|tests)\//.test(normalized);
  }

  if (kind === "setup") {
    return /\/packages\/app\/(?:src|tests)\//.test(normalized);
  }

  return false;
}

export function getTopLevelDeclarations(program) {
  const declarations = [];

  for (const statement of program.body) {
    const declaration = statement.type.startsWith("Export") ? statement.declaration : statement;

    if (!declaration) {
      continue;
    }

    if (declaration.type === "VariableDeclaration") {
      declarations.push(...declaration.declarations);

      continue;
    }

    if (
      [
        "ClassDeclaration",
        "FunctionDeclaration",
        "TSInterfaceDeclaration",
        "TSTypeAliasDeclaration",
        "TSEnumDeclaration",
      ].includes(declaration.type)
    ) {
      declarations.push(declaration);
    }
  }

  return declarations;
}

export function isExportedTopLevelDeclaration(program, declaration) {
  return program.body.some((statement) => {
    const exportedDeclaration = statement.type.startsWith("Export")
      ? statement.declaration
      : statement;

    if (exportedDeclaration === declaration) {
      return statement.type.startsWith("Export");
    }

    return (
      exportedDeclaration?.type === "VariableDeclaration" &&
      declaration.parent === exportedDeclaration &&
      statement.type.startsWith("Export")
    );
  });
}

export function getExportedName(node) {
  if (node.type === "FunctionDeclaration" || node.type === "ClassDeclaration") {
    return node.id?.name;
  }

  if (node.type === "VariableDeclarator") {
    return node.id.type === "Identifier" ? node.id.name : undefined;
  }

  if (
    ["TSInterfaceDeclaration", "TSTypeAliasDeclaration", "TSEnumDeclaration"].includes(node.type)
  ) {
    return node.id?.name;
  }

  return undefined;
}

export function getFunctionDeclarationNode(node) {
  if (node.type === "FunctionDeclaration") {
    return node;
  }

  if (
    node.type === "VariableDeclarator" &&
    ["ArrowFunctionExpression", "FunctionExpression"].includes(node.init?.type)
  ) {
    return node.init;
  }

  return undefined;
}

export function isFunctionDeclaration(node) {
  return Boolean(getFunctionDeclarationNode(node));
}

export function isPrincipalStatement(statement) {
  return ![
    "ImportDeclaration",
    "ExportAllDeclaration",
    "ExportNamedDeclaration",
    "ExportDefaultDeclaration",
    "ExpressionStatement",
  ].includes(statement.type);
}

export function getFileContractExpectedNames(descriptor) {
  const base = getFileNamePascalCase({ ...descriptor, stem: getFileBaseForContract(descriptor) });

  const camel = getFileNameCamelCase({ ...descriptor, stem: getFileBaseForContract(descriptor) });

  switch (descriptor.kind) {
    case "adapter":
      return [base.endsWith("Adapter") ? base : `${base}Adapter`];

    case "command":
      return [`${base}Command`];

    case "query":
      return [`${base}Query`];

    case "command-handler":
      return [`${base}CommandHandler`];

    case "query-handler":
      return [`${base}QueryHandler`];

    case "command-result":
      return [`${base}CommandResult`];

    case "query-result":
      return [`${base}QueryResult`];

    case "port":
      return [`${base}Port`];

    case "repository":
      return [`${base}Repository`];

    case "database":
      return [`${base}Database`];

    case "store":
      return [`${base}Store`];

    case "storage":
      return [`${base}Storage`];

    case "service":
      return [`${base}Service`];

    case "contract":
      return [`${base}Contract`];

    case "component":
      return [base];

    case "function":
      return [camel];

    case "hook":
      return [camel];

    case "view-model":
      return [`use${base}ViewModel`, `${base}ViewModel`];

    case "model":

    case "interface":

    case "type":

    case "enum":
      return [base];

    default:
      return [];
  }
}

export function getFileKindContractMessageId(kind) {
  if (["command", "query", "command-result", "query-result"].includes(kind)) {
    return "cqrsDeclaration";
  }

  if (["port", "adapter"].includes(kind)) {
    return "boundaryDeclaration";
  }

  return "declaration";
}

const fileNameContract = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      invalidName: "Files must use small-kebab-case.tipo.extensao with a known file kind.",
      unknownKind: "The file suffix '{{kind}}' is not an approved file kind.",
      invalidExtension: "The file kind '{{kind}}' requires extension '{{extension}}'.",
    },
  },
  create(context) {
    const filename = normalizeFilename(context.getFilename());

    const descriptor = getFileDescriptor(filename);

    return {
      Program(node) {
        if (!/\/packages\/|(?:^|\/)\.config\/|(?:^|\/)\.local\/operator\//.test(filename)) {
          return;
        }

        if (descriptor.kind === "index" || descriptor.kind === "declaration") {
          return;
        }

        if (!descriptor.kind || !fileKinds.has(descriptor.kind)) {
          context.report({ node, messageId: "unknownKind", data: { kind: descriptor.kind || "" } });

          return;
        }

        const validSegments = getFileStemParts(descriptor)
          .every(isSmallKebabCase);

        if (!validSegments || descriptor.basename !== descriptor.basename.toLowerCase()) {
          context.report({ node, messageId: "invalidName" });
        }

        if (
          descriptor.kind === "component" &&
          descriptor.extension !== "tsx" &&
          !["test", "spec", "test-support"].includes(descriptor.kind)
        ) {
          context.report({
            node,
            messageId: "invalidExtension",
            data: { kind: descriptor.kind, extension: "tsx" },
          });
        }

        if (
          descriptor.kind !== "component" &&
          descriptor.extension === "tsx" &&
          !["test", "spec", "test-support"].includes(descriptor.kind)
        ) {
          context.report({
            node,
            messageId: "invalidExtension",
            data: { kind: descriptor.kind, extension: "ts" },
          });
        }
      },
    };
  },
};

const fileKindLocation = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      invalidLocation: "The '{{kind}}' file kind is not allowed in this directory.",
    },
  },
  create(context) {
    const filename = normalizeFilename(context.getFilename());

    const descriptor = getFileDescriptor(filename);

    return {
      Program(node) {
        if (descriptor.kind && !isFileLocationAllowed(filename, descriptor.kind)) {
          context.report({
            node,
            messageId: "invalidLocation",
            data: { kind: descriptor.kind },
          });
        }
      },
    };
  },
};

const fileKindContract = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      declaration: "A '{{kind}}' file must contain exactly one declaration matching its contract.",
      exportedDeclaration: "The principal declaration of a '{{kind}}' file must be exported.",
      expectedName:
        "The principal declaration of this '{{kind}}' file must be named one of: {{names}}.",
      jsxOnlyComponent: "JSX is allowed only in component files.",
      componentOnlyTsx: "A component file must contain exactly one exported React component.",
      cqrsDeclaration:
        "A '{{kind}}' file must contain exactly one exported CQRS declaration with the expected name.",
      boundaryDeclaration:
        "A '{{kind}}' file must contain exactly one declaration satisfying its boundary contract.",
      portExecute: "A port must expose execute() with zero or one parameter.",
      adapterPort: "An adapter must implement exactly one interface ending in Port.",
      indexOnly:
        "index files may contain only export * from './...'; declarations and imports are forbidden.",
      indexPath: "index re-exports must target a child path in the same directory.",
      implementation: "A contract file may contain imports and its principal declaration only.",
    },
  },
  create(context) {
    const filename = normalizeFilename(context.getFilename());

    const descriptor = getFileDescriptor(filename);

    const { sourceCode } = context;

    function reportContract(node, messageId = getFileKindContractMessageId(descriptor.kind)) {
      context.report({ node, messageId, data: { kind: descriptor.kind } });
    }

    function validatePrincipal(program, expectedTypes, options = {}) {
      const { allowSupporting = false, expectedNames } = options;

      const declarations = getTopLevelDeclarations(program);

      const matching = declarations.filter((declaration) => {
        return expectedTypes.includes(declaration.type);
      });

      if ((!allowSupporting && declarations.length !== 1) || matching.length !== 1) {
        reportContract(program);

        return;
      }

      const declaration = matching[0];

      const name = getExportedName(declaration);

      if (!isExportedTopLevelDeclaration(program, declaration)) {
        context.report({
          node: declaration,
          messageId: "exportedDeclaration",
          data: { kind: descriptor.kind },
        });
      }

      if (expectedNames.length > 0 && !expectedNames.includes(name)) {
        context.report({
          node: declaration,
          messageId: "expectedName",
          data: { kind: descriptor.kind, names: expectedNames.join(", ") },
        });
      }
    }

    function validateFunctionFile(program) {
      const declarations = getTopLevelDeclarations(program)
        .filter(isFunctionDeclaration);

      const expectedNames = getFileContractExpectedNames(descriptor);

      if (declarations.length !== 1) {
        reportContract(program);

        return;
      }

      const declaration = declarations[0];

      const name = getExportedName(declaration);

      if (!isExportedTopLevelDeclaration(program, declaration)) {
        context.report({
          node: declaration,
          messageId: "exportedDeclaration",
          data: { kind: descriptor.kind },
        });
      }

      if (expectedNames.length > 0 && name !== expectedNames[0]) {
        context.report({
          node: declaration,
          messageId: "expectedName",
          data: { kind: descriptor.kind, names: expectedNames.join(", ") },
        });
      }
    }

    function validateComponentFile(program) {
      const declarations = getTopLevelDeclarations(program)
        .filter(isFunctionDeclaration);

      const components = declarations.filter((declaration) => {
        const functionNode = getFunctionDeclarationNode(declaration);

        return Boolean(functionNode && isReactComponentFunction(functionNode, sourceCode));
      });

      if (declarations.length !== 1 || components.length !== 1) {
        context.report({ node: program, messageId: "componentOnlyTsx" });

        return;
      }

      const declaration = components[0];

      const name = getExportedName(declaration);

      const expectedNames = getFileContractExpectedNames(descriptor);

      const allowedNames = [
        ...expectedNames,
        ...(new Set(["ui", "ui-content"])
          .has(getSourceLayer(filename))
          ? expectedNames.map((expectedName) => {
            return `UI${expectedName}`;
          })
          : []),
      ];

      if (!isExportedTopLevelDeclaration(program, declaration)) {
        context.report({
          node: declaration,
          messageId: "exportedDeclaration",
          data: { kind: descriptor.kind },
        });
      }

      if (!allowedNames.includes(name)) {
        context.report({
          node: declaration,
          messageId: "expectedName",
          data: { kind: descriptor.kind, names: allowedNames.join(", ") },
        });
      }
    }

    function validatePort(program) {
      const declarations = getTopLevelDeclarations(program);

      const interfaces = declarations.filter((declaration) => {
        return declaration.type === "TSInterfaceDeclaration";
      });

      if (
        declarations.length !== 1 ||
        interfaces.length !== 1 ||
        !interfaces[0].id.name.endsWith("Port")
      ) {
        reportContract(program);

        return;
      }

      const executeMembers = interfaces[0].body.body.filter((member) => {
        return member.key?.type === "Identifier" && member.key.name === "execute";
      });

      if (executeMembers.length !== 1 || executeMembers[0].params?.length > 1) {
        context.report({ node: interfaces[0], messageId: "portExecute" });
      }
    }

    function validateAdapter(program) {
      const declarations = getTopLevelDeclarations(program);

      const classes = declarations.filter((declaration) => {
        return declaration.type === "ClassDeclaration";
      });

      if (
        declarations.length !== 1 ||
        classes.length !== 1 ||
        !classes[0].id?.name.endsWith("Adapter")
      ) {
        reportContract(program);

        return;
      }

      const implementedPorts = classes[0].implements?.filter((item) => {
        return item.expression?.type === "Identifier" && item.expression.name.endsWith("Port");
      });

      if (implementedPorts?.length !== 1) {
        context.report({ node: classes[0], messageId: "adapterPort" });
      }

      const expectedNames = getFileContractExpectedNames(descriptor);

      if (
        !expectedNames.some((expectedName) => {
          return classes[0].id.name.endsWith(expectedName);
        })
      ) {
        context.report({
          node: classes[0],
          messageId: "expectedName",
          data: { kind: descriptor.kind, names: expectedNames.join(", ") },
        });
      }
    }

    function validateIndex(program) {
      for (const statement of program.body) {
        if (statement.type !== "ExportAllDeclaration") {
          context.report({ node: statement, messageId: "indexOnly" });

          continue;
        }

        const source = statement.source?.value;

        const isLocalChild = typeof source === "string" && source.startsWith("./");

        const isExternalPackage = typeof source === "string" && !source.startsWith(".");

        if (
          typeof source !== "string" ||
          (!isLocalChild && !isExternalPackage) ||
          source.includes("../")
        ) {
          context.report({ node: statement, messageId: "indexPath" });
        }
      }
    }

    return {
      Program(program) {
        if (descriptor.kind === "index") {
          validateIndex(program);

          return;
        }

        if (!descriptor.kind || descriptor.kind === "declaration") {
          return;
        }

        if (
          descriptor.kind === "test" ||
          descriptor.kind === "spec" ||
          descriptor.kind === "test-support"
        ) {
          return;
        }

        if (descriptor.kind === "config") {
          return;
        }

        if (descriptor.kind !== "component" && containsJsx(program, sourceCode)) {
          context.report({ node: program, messageId: "jsxOnlyComponent" });
        }

        if (descriptor.kind === "component") {
          validateComponentFile(program);

          return;
        }

        if (["function", "hook", "view-model", "composition"].includes(descriptor.kind)) {
          validateFunctionFile(program);

          return;
        }

        if (descriptor.kind === "port") {
          validatePort(program);

          return;
        }

        if (descriptor.kind === "adapter") {
          validateAdapter(program);

          return;
        }

        if (["command", "query", "command-result", "query-result"].includes(descriptor.kind)) {
          const declarationType = ["TSInterfaceDeclaration", "TSTypeAliasDeclaration"];

          validatePrincipal(program, declarationType, {
            expectedNames: getFileContractExpectedNames(descriptor),
          });

          return;
        }

        if (["interface", "type", "model", "enum"].includes(descriptor.kind)) {
          const declarationTypes = {
            interface: ["TSInterfaceDeclaration"],
            type: ["TSTypeAliasDeclaration"],
            model: ["TSInterfaceDeclaration", "TSTypeAliasDeclaration"],
            enum: ["TSEnumDeclaration"],
          };

          const expectedNames = getFileContractExpectedNames(descriptor);

          const isUiPropsFile =
            new Set(["ui", "ui-content"])
              .has(getSourceLayer(filename)) &&
            expectedNames.some((expectedName) => {
              return expectedName.endsWith("Props");
            });

          validatePrincipal(program, declarationTypes[descriptor.kind], {
            expectedNames: isUiPropsFile
              ? [
                ...expectedNames,
                ...expectedNames.map((expectedName) => {
                  return `UI${expectedName}`;
                }),
              ]
              : expectedNames,
          });

          return;
        }

        if (["repository", "database", "storage", "store", "service"].includes(descriptor.kind)) {
          if (descriptor.kind === "service") {
            const functions = getTopLevelDeclarations(program)
              .filter(isFunctionDeclaration);

            if (functions.length !== 1 || !isExportedTopLevelDeclaration(program, functions[0])) {
              reportContract(program);
            }

            return;
          }

          validatePrincipal(program, ["ClassDeclaration"], {
            allowSupporting: true,
            expectedNames: getFileContractExpectedNames(descriptor),
          });

          return;
        }

        if (descriptor.kind === "ports") {
          const interfaces = getTopLevelDeclarations(program)
            .filter((declaration) => {
              return declaration.type === "TSInterfaceDeclaration";
            });

          if (
            interfaces.length === 0 ||
            interfaces.some((declaration) => {
              return (
                !declaration.id.name.endsWith("Port") && declaration.id.name !== "ApplicationPorts"
              );
            })
          ) {
            reportContract(program);
          }

          return;
        }

        if (descriptor.kind === "services") {
          const declarations = getTopLevelDeclarations(program);

          const functions = declarations.filter(isFunctionDeclaration);

          const interfaces = declarations.filter((declaration) => {
            return declaration.type === "TSInterfaceDeclaration";
          });

          if (functions.length !== 1 || interfaces.length !== 1) {
            reportContract(program);
          }

          return;
        }

        if (descriptor.kind === "enums") {
          const declarations = getTopLevelDeclarations(program);

          if (
            declarations.length === 0 ||
            declarations.some((declaration) => {
              return declaration.type !== "TSEnumDeclaration";
            })
          ) {
            reportContract(program);
          }

          return;
        }

        if (descriptor.kind === "schema") {
          const declarations = getTopLevelDeclarations(program)
            .filter((declaration) => {
              return (
                declaration.type === "VariableDeclarator" &&
              getExportedName(declaration)
                ?.toLowerCase()
                .endsWith("schema")
              );
            });

          if (declarations.length === 0) {
            reportContract(program);
          }

          return;
        }

        if (
          ["config", "locale", "styles", "setup", "tool", "operator", "plugin"].includes(
            descriptor.kind,
          )
        ) {
          if (
            ["tool", "operator", "plugin", "styles", "locale", "setup"].includes(descriptor.kind)
          ) {
            return;
          }

          const implementationStatements = program.body.filter(isPrincipalStatement);

          if (implementationStatements.length > 1) {
            context.report({ node: program, messageId: "implementation" });
          }
        }
      },
    };
  },
};

export function isReactComponentFunction(node, sourceCode) {
  const name = getComponentName(node);

  return Boolean(name && /^[A-Z]/.test(name) && containsJsx(node.body, sourceCode));
}

export function getTypeName(parameter) {
  const annotation = parameter.typeAnnotation?.typeAnnotation;

  return annotation?.type === "TSTypeReference" && annotation.typeName.type === "Identifier"
    ? annotation.typeName.name
    : undefined;
}

const componentPropsContract = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      destructured: "Component props must be received through a parameter named props.",
      parameterName: "Component props parameters must be named props.",
      missingType: "Component props must use a named <ComponentName>Props type.",
      wrongType: "Component props must use the named <ComponentName>Props type.",
    },
  },
  create(context) {
    const { sourceCode } = context;

    function validate(node) {
      if (!isReactComponentFunction(node, sourceCode) || node.params.length === 0) {
        return;
      }

      const parameter = node.params[0];

      if (parameter.type !== "Identifier") {
        context.report({ node: parameter, messageId: "destructured" });

        return;
      }

      if (parameter.name !== "props") {
        context.report({ node: parameter, messageId: "parameterName" });
      }

      const expected = `${getComponentName(node)}Props`;

      const actual = getTypeName(parameter);

      if (!actual) {
        context.report({ node: parameter, messageId: "missingType" });
      } else if (actual !== expected) {
        context.report({ node: parameter, messageId: "wrongType" });
      }
    }

    return {
      FunctionDeclaration: validate,
      FunctionExpression: validate,
      ArrowFunctionExpression: validate,
    };
  },
};

const mapToImportedComponent = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      invalidMap:
        "A JSX map must return exactly one self-closing component imported from another file.",
    },
  },
  create(context) {
    const importedBindings = new Set();

    return {
      ImportDeclaration(node) {
        for (const name of collectImports(node)) {
          importedBindings.add(name);
        }
      },
      CallExpression(node) {
        if (!isMapCall(node)) {
          return;
        }

        const callback = node.arguments[0];

        if (
          !callback ||
          !["ArrowFunctionExpression", "FunctionExpression"].includes(callback.type)
        ) {
          return;
        }

        if (!containsJsx(callback.body, context.sourceCode)) {
          return;
        }

        if (!isImportedSelfClosingComponent(getCallbackExpression(callback), importedBindings)) {
          context.report({ node, messageId: "invalidMap" });
        }
      },
    };
  },
};

export function unwrapBranch(node) {
  const current = unwrapExpression(node);

  if (current?.type === "ReturnStatement" || current?.type === "ExpressionStatement") {
    return unwrapBranch(current.argument || current.expression);
  }

  if (current?.type === "BlockStatement") {
    const statements = current.body.filter((statement) => {
      return statement.type !== "EmptyStatement";
    });

    return statements.length === 1 ? unwrapBranch(statements[0]) : current;
  }

  return current;
}

export function isInsideComponent(node, sourceCode) {
  let current = node.parent;

  while (current) {
    if (
      ["FunctionDeclaration", "FunctionExpression", "ArrowFunctionExpression"].includes(
        current.type,
      ) &&
      isReactComponentFunction(current, sourceCode)
    ) {
      return true;
    }

    current = current.parent;
  }

  return false;
}

const conditionalRenderingDelegation = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      inlineConditionalRender:
        "Conditional JSX branches must delegate to one self-closing component without implementing its visual tree.",
    },
  },
  create(context) {
    const importedBindings = new Set();

    const { sourceCode } = context;

    function report(branch, owner) {
      if (!isInsideComponent(owner, sourceCode)) {
        return;
      }

      const expression = unwrapBranch(branch);

      if (!containsJsx(expression, sourceCode)) {
        return;
      }

      if (!isImportedSelfClosingComponent(expression, importedBindings)) {
        context.report({ node: expression || branch, messageId: "inlineConditionalRender" });
      }
    }

    return {
      ImportDeclaration(node) {
        for (const name of collectImports(node)) {
          importedBindings.add(name);
        }
      },
      IfStatement(node) {
        report(node.consequent, node);

        if (node.alternate) {
          report(node.alternate, node);
        }
      },
      ConditionalExpression(node) {
        report(node.consequent, node);

        report(node.alternate, node);
      },
      LogicalExpression(node) {
        if (["&&", "||"].includes(node.operator)) {
          report(node.right, node);
        }
      },
    };
  },
};

const noComplexInlineHandler = {
  meta: {
    type: "suggestion",
    schema: [],
    messages: { complexHandler: "Extract complex JSX handlers into a named function." },
  },
  create(context) {
    const { sourceCode } = context;

    return {
      JSXAttribute(node) {
        if (node.name.type !== "JSXIdentifier" || !/^on[A-Z]/.test(node.name.name)) {
          return;
        }

        const expression = node.value?.expression;

        if (
          !expression ||
          !["ArrowFunctionExpression", "FunctionExpression"].includes(expression.type)
        ) {
          return;
        }

        if (
          expression.body.type === "BlockStatement" &&
          (expression.body.body.length > 1 || containsControlFlow(expression.body, sourceCode))
        ) {
          context.report({ node, messageId: "complexHandler" });
        }
      },
    };
  },
};

const noClassComponent = {
  meta: {
    type: "problem",
    schema: [],
    messages: { classComponent: "Use a function component instead of a React class component." },
  },
  create(context) {
    return {
      ClassDeclaration(node) {
        if (
          ["Component", "PureComponent"].includes(node.superClass?.name) ||
          node.superClass?.property?.name === "Component" ||
          node.superClass?.property?.name === "PureComponent"
        ) {
          context.report({ node, messageId: "classComponent" });
        }
      },
      ClassExpression(node) {
        if (
          ["Component", "PureComponent"].includes(node.superClass?.name) ||
          node.superClass?.property?.name === "Component" ||
          node.superClass?.property?.name === "PureComponent"
        ) {
          context.report({ node, messageId: "classComponent" });
        }
      },
    };
  },
};

const noSqlOutsideRepository = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      sqlBoundary:
        "SQL.js and low-level SQLite access are restricted to the content repository adapter.",
    },
  },
  create(context) {
    const filename = context.getFilename()
      .replaceAll("\\", "/");

    const isRepository = filename.includes(
      "/packages/pkg-adapter-data-v1/src/adapters/content/sqljs/",
    );

    if (!filename.includes("/packages/")) {
      return {};
    }

    return {
      ImportDeclaration(node) {
        if (!isRepository && /^sql\.js(?:\/|$)/u.test(node.source.value)) {
          context.report({ node, messageId: "sqlBoundary" });
        }
      },
    };
  },
};

const noExplicitAny = {
  meta: {
    type: "problem",
    schema: [],
    messages: { explicitAny: "Use an explicit type instead of any." },
  },
  create(context) {
    return {
      TSAnyKeyword(node) {
        context.report({ node, messageId: "explicitAny" });
      },
    };
  },
};

const noUnsafeDoubleCast = {
  meta: {
    type: "problem",
    schema: [],
    messages: { doubleCast: "Do not cast through unknown; narrow the value explicitly." },
  },
  create(context) {
    return {
      TSAsExpression(node) {
        if (
          node.expression.type === "TSAsExpression" &&
          node.expression.typeAnnotation.type === "TSUnknownKeyword"
        ) {
          context.report({ node, messageId: "doubleCast" });
        }
      },
    };
  },
};

const noForbiddenTypeCasts = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      forbiddenCast:
        'Avoid casting to {{type}}. Add a nearby "awkward-type-ignore: <reason>" comment only when the cast is unavoidable.',
    },
  },
  create(context) {
    const { sourceCode } = context;

    const comments = sourceCode.getAllComments();

    function getForbiddenType(node) {
      if (node.type === "TSAnyKeyword") {
        return "any";
      }

      if (node.type === "TSNeverKeyword") {
        return "never";
      }

      if (node.type === "TSUnknownKeyword") {
        return "unknown";
      }

      if (
        node.type === "TSTypeReference" &&
        node.typeName.type === "Identifier" &&
        node.typeName.name === "Record"
      ) {
        return "Record";
      }

      return undefined;
    }

    function hasJustification(node) {
      return comments.some((comment) => {
        const isAdjacent =
          comment.loc.end.line === node.loc.start.line ||
          comment.loc.end.line === node.loc.start.line - 1;

        return isAdjacent && /^\s*awkward-type-ignore:\s+\S/u.test(comment.value);
      });
    }

    function reportCast(node) {
      const type = getForbiddenType(node.typeAnnotation);

      if (type !== undefined && !hasJustification(node)) {
        context.report({ node, messageId: "forbiddenCast", data: { type } });
      }
    }

    return {
      TSAsExpression: reportCast,
      TSTypeAssertion: reportCast,
    };
  },
};

const maxFunctionParameters = {
  meta: {
    type: "problem",
    schema: [{ type: "integer", minimum: 0 }],
    messages: {
      tooManyParameters: "Functions may have at most {{maximum}} positional parameters.",
    },
  },
  create(context) {
    const maximum = context.options[0] ?? 3;

    return {
      FunctionDeclaration(node) {
        if (node.params.length > maximum) {
          context.report({ node, messageId: "tooManyParameters", data: { maximum } });
        }
      },
      FunctionExpression(node) {
        if (node.params.length > maximum) {
          context.report({ node, messageId: "tooManyParameters", data: { maximum } });
        }
      },
      ArrowFunctionExpression(node) {
        if (node.params.length > maximum) {
          context.report({ node, messageId: "tooManyParameters", data: { maximum } });
        }
      },
    };
  },
};

const noGenericIdentifiers = {
  meta: {
    type: "suggestion",
    schema: [],
    messages: {
      genericIdentifier: "Use a name that expresses the responsibility of this binding.",
    },
  },
  create(context) {
    const names = new Set(["foo", "bar", "baz", "tmp", "obj"]);

    return {
      VariableDeclarator(node) {
        if (node.id.type === "Identifier" && names.has(node.id.name)) {
          context.report({ node: node.id, messageId: "genericIdentifier" });
        }
      },
      FunctionDeclaration(node) {
        if (node.id && names.has(node.id.name)) {
          context.report({ node: node.id, messageId: "genericIdentifier" });
        }
      },
      FunctionExpression(node) {
        for (const parameter of node.params) {
          if (parameter.type === "Identifier" && names.has(parameter.name)) {
            context.report({ node: parameter, messageId: "genericIdentifier" });
          }
        }
      },
      ArrowFunctionExpression(node) {
        for (const parameter of node.params) {
          if (parameter.type === "Identifier" && names.has(parameter.name)) {
            context.report({ node: parameter, messageId: "genericIdentifier" });
          }
        }
      },
    };
  },
};

const noInlineObjectTypeInParameters = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      inlineType: "Function parameters must use a named type instead of an inline object type.",
    },
  },
  create(context) {
    return {
      ":function": function (node) {
        for (const parameter of node.params) {
          if (parameter.typeAnnotation?.typeAnnotation?.type === "TSTypeLiteral") {
            context.report({ node: parameter, messageId: "inlineType" });
          }
        }
      },
    };
  },
};

const noAnonymousComplexTypes = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      anonymousType:
        "Complex type annotations must use a named type or interface. Extract this type into its own declaration.",
    },
  },
  create(context) {
    function isTransparentWrapper(node) {
      return node.type === "TSParenthesizedType" || node.type === "TSTypeOperator";
    }

    function isNamedTypeRoot(node) {
      let current = node;

      let { parent } = current;

      while (parent && isTransparentWrapper(parent) && parent.typeAnnotation === current) {
        current = parent;

        ({ parent } = current);
      }

      if (parent?.type === "TSTypeAliasDeclaration" && parent.typeAnnotation === current) {
        return true;
      }

      if (
        parent?.type === "TSTypeParameterInstantiation" &&
        parent.parent?.type === "TSTypeReference"
      ) {
        return true;
      }

      return (
        parent?.type === "ExportNamedDeclaration" &&
        parent.declaration?.type === "TSTypeAliasDeclaration" &&
        parent.declaration.typeAnnotation === current
      );
    }

    function reportAnonymousType(node) {
      if (!isNamedTypeRoot(node)) {
        context.report({ node, messageId: "anonymousType" });
      }
    }

    return {
      TSTypeLiteral: reportAnonymousType,
      TSFunctionType: reportAnonymousType,
      TSConstructorType: reportAnonymousType,
      TSMappedType: reportAnonymousType,
      TSConditionalType: reportAnonymousType,
      TSTupleType: reportAnonymousType,
    };
  },
};

const noGenericPropsTypeName = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      genericName: "Use a responsibility-specific props type name such as <ComponentName>Props.",
    },
  },
  create(context) {
    const names = new Set(["Props", "ComponentProps", "Tipagem"]);

    return {
      TSTypeAliasDeclaration(node) {
        if (names.has(node.id.name)) {
          context.report({ node: node.id, messageId: "genericName" });
        }
      },
      TSInterfaceDeclaration(node) {
        if (names.has(node.id.name)) {
          context.report({ node: node.id, messageId: "genericName" });
        }
      },
    };
  },
};

const noUnjustifiedSuppression = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      tsIgnore: "Use @ts-expect-error with a justification instead of @ts-ignore.",
      tsNoCheck: "Do not disable TypeScript checking for a file.",
      missingReason: "Tool suppressions must include a justification after --.",
      multipleRules: "A suppression must target exactly one rule.",
    },
  },
  create(context) {
    return {
      Program() {
        for (const comment of context.sourceCode.getAllComments()) {
          const { value } = comment;

          if (/@ts-ignore\b/.test(value)) {
            context.report({ node: comment, messageId: "tsIgnore" });
          }

          if (/@ts-nocheck\b/.test(value)) {
            context.report({ node: comment, messageId: "tsNoCheck" });
          }

          if (/@ts-expect-error\b/.test(value) && !/@ts-expect-error\b.+/.test(value)) {
            context.report({ node: comment, messageId: "missingReason" });
          }

          const suppression = value.match(
            /eslint-disable(?:-next-line)?\s+([^-]+?)\s*--\s*(\S.*)$/,
          );

          if (/eslint-disable(?:-next-line)?\b/.test(value)) {
            if (!suppression) {
              context.report({ node: comment, messageId: "missingReason" });
            } else if (
              suppression[1]
                .split(",")
                .map((rule) => {
                  return rule.trim();
                })
                .filter(Boolean).length !== 1
            ) {
              context.report({ node: comment, messageId: "multipleRules" });
            }
          }
        }
      },
    };
  },
};

const paddingAroundTypeStatements = {
  meta: {
    type: "layout",
    fixable: "whitespace",
    schema: [],
    messages: { expectedBlankLine: "TypeScript type statements must be separated by blank lines." },
  },
  create(context) {
    function check(node) {
      const { parent } = node;

      if (!Array.isArray(parent?.body)) {
        return;
      }

      const index = parent.body.indexOf(node);

      const previous = parent.body[index - 1];

      const next = parent.body[index + 1];

      if (previous && previous.loc.end.line + 1 === node.loc.start.line) {
        context.report({ node, messageId: "expectedBlankLine" });
      }

      if (
        next &&
        next.type !== "TSTypeAliasDeclaration" &&
        next.type !== "TSInterfaceDeclaration" &&
        node.loc.end.line + 1 === next.loc.start.line
      ) {
        context.report({ node, messageId: "expectedBlankLine" });
      }
    }

    return { TSTypeAliasDeclaration: check, TSInterfaceDeclaration: check };
  },
};

const oneFunctionPerFile = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      multipleFunctions:
        "Implementation files may declare only one project function; extract additional functions into their own files.",
    },
  },
  create(context) {
    let count = 0;

    function increment(node) {
      if (isTopLevel(node)) {
        count += 1;
      }
    }

    return {
      FunctionDeclaration: increment,
      FunctionExpression: increment,
      ArrowFunctionExpression: increment,
      "Program:exit": function (node) {
        if (count > 1) {
          context.report({ node, messageId: "multipleFunctions" });
        }
      },
    };
  },
};

const oneExportedFunctionPerFile = {
  meta: {
    type: "problem",
    fixable: "code",
    schema: [],
    messages: {
      multipleFunctions:
        "Project files may declare only one top-level function; extract each function into its own file.",
      notExported: "Top-level project functions must be exported.",
    },
  },
  create(context) {
    const functions = [];

    function collect(node) {
      if (isTopLevelFunction(node)) {
        functions.push(node);
      }
    }

    return {
      FunctionDeclaration: collect,
      FunctionExpression: collect,
      ArrowFunctionExpression: collect,
      "Program:exit": function (node) {
        if (functions.length > 1) {
          context.report({ node, messageId: "multipleFunctions" });
        }

        for (const functionNode of functions) {
          if (!isExportedFunction(functionNode, node)) {
            const declarator = getFunctionVariableDeclarator(functionNode);

            const variableDeclaration = declarator?.parent;

            const canFixVariable =
              variableDeclaration?.type === "VariableDeclaration" &&
              variableDeclaration.declarations.length === 1;

            context.report({
              node: functionNode,
              messageId: "notExported",
              fix(fixer) {
                if (functionNode.type === "FunctionDeclaration") {
                  return fixer.insertTextBefore(functionNode, "export ");
                }

                if (canFixVariable) {
                  return fixer.insertTextBefore(variableDeclaration, "export ");
                }

                return null;
              },
            });
          }
        }
      },
    };
  },
};

const purposefulNaming = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      functionCase: "Function names must use lower camelCase.",
      functionPurpose:
        "Function names must describe an action with a recognized purpose verb; avoid noun-only or generic names.",
      componentCase: "React component functions must use PascalCase.",
      viewModelName: "ViewModel hooks must use the use<Name>ViewModel naming convention.",
      classCase: "Class names must use PascalCase.",
      getClassSuffix:
        "Classes in this file must end with {{suffix}} to match the file responsibility.",
      classSuffix:
        "Classes in this file must end with {{suffix}} to match the file responsibility.",
      contractCase: "Interfaces and type aliases must use PascalCase.",
      getContractSuffix:
        "Interfaces and type aliases in this file must end with one of: {{suffixes}}.",
      contractSuffix:
        "Interfaces and type aliases in this file must end with one of: {{suffixes}}.",
    },
  },
  create(context) {
    const filename = context.getFilename()
      .replaceAll("\\", "/");

    const { sourceCode } = context;

    if (shouldIgnoreFunctionPolicy(filename)) {
      return {};
    }

    const viewModelFile = filename.endsWith(".view-model.ts");

    const requiredClassSuffix = getClassSuffix(filename);

    const requiredContractSuffixes = getContractSuffix(filename);

    function reportFunctionName(node, name) {
      if (!name) {
        return;
      }

      const isComponent = containsJsx(node.body, sourceCode);

      if (isComponent) {
        if (!/^[A-Z][A-Za-z0-9]*$/.test(name)) {
          context.report({ node, messageId: "componentCase" });
        }

        return;
      }

      if (!/^[a-z][A-Za-z0-9]*$/.test(name)) {
        context.report({ node, messageId: "functionCase" });
      } else if (!startsWithPurposeVerb(name)) {
        context.report({ node, messageId: "functionPurpose" });
      }

      if (viewModelFile && isTopLevel(node) && !/^use[A-Z][A-Za-z0-9]*ViewModel$/.test(name)) {
        context.report({ node, messageId: "viewModelName" });
      }
    }

    function reportContractName(node) {
      const name = node.id?.name;

      if (!name) {
        return;
      }

      if (!/^[A-Z][A-Za-z0-9]*$/.test(name)) {
        context.report({ node, messageId: "contractCase" });
      }

      if (
        requiredContractSuffixes.length > 0 &&
        !requiredContractSuffixes.some((suffix) => {
          return name.endsWith(suffix);
        })
      ) {
        context.report({
          node,
          messageId: "contractSuffix",
          data: { suffixes: requiredContractSuffixes.join(", ") },
        });
      }
    }

    return {
      FunctionDeclaration(node) {
        reportFunctionName(node, getFunctionDeclarationName(node));
      },
      FunctionExpression(node) {
        reportFunctionName(node, getFunctionDeclarationName(node));
      },
      ArrowFunctionExpression(node) {
        reportFunctionName(node, getFunctionDeclarationName(node));
      },
      ClassDeclaration(node) {
        const name = node.id?.name;

        if (!name) {
          return;
        }

        if (!/^[A-Z][A-Za-z0-9]*$/.test(name)) {
          context.report({ node, messageId: "classCase" });
        }

        if (requiredClassSuffix && !name.endsWith(requiredClassSuffix)) {
          context.report({
            node,
            messageId: "classSuffix",
            data: { suffix: requiredClassSuffix },
          });
        }
      },
      TSInterfaceDeclaration: reportContractName,
      TSTypeAliasDeclaration: reportContractName,
    };
  },
};

const domainFunctionsInDomainPackage = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      misplaced:
        "Domain logic functions must live in packages/pkg-domain; adapters must depend on domain ports instead of defining domain logic.",
    },
  },
  create(context) {
    const filename = context.getFilename()
      .replaceAll("\\", "/");

    if (!filename.includes("/packages/pkg-adapter-data-v1/src/study/")) {
      return {};
    }

    function report(node) {
      if (isTopLevelFunction(node)) {
        context.report({ node, messageId: "misplaced" });
      }
    }

    return {
      FunctionDeclaration: report,
      FunctionExpression: report,
      ArrowFunctionExpression: report,
    };
  },
};

const domainFunctionPurity = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      externalState:
        "Domain functions must be pure and cannot read clocks, randomness, browser state, logging or network APIs directly.",
      parameterMutation: "Domain functions must not mutate their parameters.",
    },
  },
  create(context) {
    const filename = context.getFilename()
      .replaceAll("\\", "/");

    const functionStack = [];

    if (!filename.includes("/packages/pkg-domain/")) {
      return {};
    }

    function currentFunction() {
      return functionStack.at(-1);
    }

    function isParameterIdentifier(node) {
      const functionNode = currentFunction();

      return Boolean(
        functionNode?.params.some((parameter) => {
          return parameter.type === "Identifier" && parameter.name === node.name;
        }),
      );
    }

    function isParameterRoot(node) {
      let current = node;

      while (current?.type === "MemberExpression") {
        current = current.object;
      }

      return current?.type === "Identifier" && isParameterIdentifier(current);
    }

    return {
      FunctionDeclaration: (node) => {
        return functionStack.push(node);
      },
      FunctionExpression: (node) => {
        return functionStack.push(node);
      },
      ArrowFunctionExpression: (node) => {
        return functionStack.push(node);
      },
      "FunctionDeclaration:exit": () => {
        return functionStack.pop();
      },
      "FunctionExpression:exit": () => {
        return functionStack.pop();
      },
      "ArrowFunctionExpression:exit": () => {
        return functionStack.pop();
      },
      NewExpression(node) {
        if (currentFunction() && node.callee.type === "Identifier" && node.callee.name === "Date") {
          context.report({ node, messageId: "externalState" });
        }
      },
      CallExpression(node) {
        if (!currentFunction()) {
          return;
        }

        const { callee } = node;

        if (
          (callee.type === "MemberExpression" &&
            callee.object.type === "Identifier" &&
            callee.object.name === "Math" &&
            callee.property.type === "Identifier" &&
            callee.property.name === "random") ||
          (callee.type === "MemberExpression" &&
            callee.object.type === "Identifier" &&
            ["Date", "performance"].includes(callee.object.name) &&
            callee.property.type === "Identifier" &&
            callee.property.name === "now") ||
          (callee.type === "Identifier" && callee.name === "fetch") ||
          (callee.type === "MemberExpression" &&
            callee.object.type === "Identifier" &&
            ["console", "localStorage", "indexedDB", "window", "document"].includes(
              callee.object.name,
            ))
        ) {
          context.report({ node, messageId: "externalState" });
        }
      },
      AssignmentExpression(node) {
        if (currentFunction() && isParameterRoot(node.left)) {
          context.report({ node, messageId: "parameterMutation" });
        }
      },
      UpdateExpression(node) {
        if (currentFunction() && isParameterRoot(node.argument)) {
          context.report({ node, messageId: "parameterMutation" });
        }
      },
    };
  },
};

const utilsModuleBoundary = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      domainImport:
        "Generic utility modules must not depend on domain, application or adapter packages.",
    },
  },
  create(context) {
    const filename = context.getFilename()
      .replaceAll("\\", "/");

    if (!filename.includes("/packages/pkg-utils/")) {
      return {};
    }

    return {
      ImportDeclaration(node) {
        if (
          /^@guesant\/saberes-(?:domain|application|adapter)/.test(node.source.value) ||
          /(?:^|\/)pkg-(?:domain|application|adapter)(?:\/|$)/.test(node.source.value)
        ) {
          context.report({ node, messageId: "domainImport" });
        }
      },
    };
  },
};

const noVisualPropsOutsideUi = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      visualProp:
        "The sx, style, and css props are only allowed inside UI layers; use a UI variant or component.",
    },
  },
  create(context) {
    return {
      JSXAttribute(node) {
        if (node.name.type === "JSXIdentifier" && ["sx", "style", "css"].includes(node.name.name)) {
          context.report({ node, messageId: "visualProp" });
        }
      },
      Property(node) {
        const key = node.key.type === "Identifier" ? node.key.name : node.key.value;

        if (["sx", "style", "css"].includes(key)) {
          context.report({ node, messageId: "visualProp" });
        }
      },
    };
  },
};

const noMuiReexport = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      directExport: "UI modules must export functional wrappers, not MUI or Emotion bindings.",
    },
  },
  create(context) {
    const restricted = new Set();

    return {
      ImportDeclaration(node) {
        if (/^@(mui|emotion)\//.test(node.source.value)) {
          for (const specifier of node.specifiers) {
            restricted.add(specifier.local.name);
          }
        }
      },
      ExportAllDeclaration(node) {
        if (/^@(mui|emotion)\//.test(node.source.value)) {
          context.report({ node, messageId: "directExport" });
        }
      },
      ExportNamedDeclaration(node) {
        if (node.source && /^@(mui|emotion)\//.test(node.source.value)) {
          context.report({ node, messageId: "directExport" });
        }

        for (const specifier of node.specifiers || []) {
          if (restricted.has(specifier.local.name)) {
            context.report({ node: specifier, messageId: "directExport" });
          }
        }
      },
      ExportDefaultDeclaration(node) {
        if (node.declaration.type === "Identifier" && restricted.has(node.declaration.name)) {
          context.report({ node, messageId: "directExport" });
        }
      },
    };
  },
};

const wildcardReexportsOnlyInIndex = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      wildcardReexport: "Use export * only from index.ts files.",
    },
  },
  create(context) {
    return {
      ExportAllDeclaration(node) {
        const fileName = context.getFilename()
          .split(/[\\/]/)
          .at(-1);

        if (fileName !== "index.ts" && fileName !== "index.tsx") {
          context.report({ node, messageId: "wildcardReexport" });
        }
      },
    };
  },
};

const noNamedReexports = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      namedReexport: "Use export * only from index.ts files; named re-exports are not allowed.",
    },
  },
  create(context) {
    return {
      ExportNamedDeclaration(node) {
        if (node.source) {
          context.report({ node, messageId: "namedReexport" });
        }
      },
    };
  },
};

const noParentReexports = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      parentReexport: "Re-export only from the current directory or a descendant module.",
    },
  },
  create(context) {
    return {
      ExportAllDeclaration(node) {
        if (node.source.value.startsWith("../")) {
          context.report({ node, messageId: "parentReexport" });
        }
      },
      ExportNamedDeclaration(node) {
        if (node.source?.value.startsWith("../")) {
          context.report({ node, messageId: "parentReexport" });
        }
      },
    };
  },
};

export function isExecuteNode(node) {
  if (
    [
      "ClassMethod",
      "MethodDefinition",
      "ObjectMethod",
      "TSMethodSignature",
      "TSDeclareMethod",
    ].includes(node.type)
  ) {
    return (
      (node.key.type === "Identifier" && node.key.name === "execute") ||
      (node.key.type === "Literal" && node.key.value === "execute")
    );
  }

  if (node.type === "FunctionDeclaration") {
    return node.id?.name === "execute";
  }

  if (node.type === "VariableDeclarator") {
    return (
      node.id.type === "Identifier" &&
      node.id.name === "execute" &&
      ["ArrowFunctionExpression", "FunctionExpression"].includes(node.init?.type)
    );
  }

  return false;
}

const executeSingleParameter = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      multipleParameters: "execute() must accept at most one parameter.",
      restParameter: "execute() must not use a rest parameter; pass one input object instead.",
    },
  },
  create(context) {
    function validateExecute(node) {
      const parameters = node.params ?? [];

      const restParameter = parameters.find((parameter) => {
        return parameter.type === "RestElement";
      });

      if (restParameter) {
        context.report({ node: restParameter, messageId: "restParameter" });

        return;
      }

      if (parameters.length > 1) {
        context.report({ node, messageId: "multipleParameters" });
      }
    }

    return {
      ClassMethod(node) {
        if (isExecuteNode(node)) {
          validateExecute(node);
        }
      },
      MethodDefinition(node) {
        if (isExecuteNode(node)) {
          validateExecute(node.value);
        }
      },
      ObjectMethod(node) {
        if (isExecuteNode(node)) {
          validateExecute(node);
        }
      },
      TSMethodSignature(node) {
        if (isExecuteNode(node)) {
          validateExecute(node);
        }
      },
      TSDeclareMethod(node) {
        if (isExecuteNode(node)) {
          validateExecute(node);
        }
      },
      FunctionDeclaration(node) {
        if (isExecuteNode(node)) {
          validateExecute(node);
        }
      },
      VariableDeclarator(node) {
        if (isExecuteNode(node)) {
          validateExecute(node.init);
        }
      },
    };
  },
};

export function isAdapterFile(filename) {
  return filename.includes("/packages/pkg-adapter-") && filename.includes("/src/adapters/");
}

export function isClassMethodNamed(node, name) {
  return (
    ["ClassMethod", "MethodDefinition"].includes(node.type) &&
    ((node.key.type === "Identifier" && node.key.name === name) ||
      (node.key.type === "Literal" && node.key.value === name))
  );
}

export function toPascalCase(value) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => {
      return `${part[0].toUpperCase()}${part.slice(1)}`;
    })
    .join("");
}

export function getCqrsFile(filename) {
  const match = filename.match(
    /\/packages\/pkg-application\/src\/(commands|queries|use-cases)\/([a-z0-9-]+)\.(command|command-handler|command-result|query|query-handler|query-result)\.ts$/,
  );

  if (!match) {
    return undefined;
  }

  return {
    operation: toPascalCase(match[2]),
    family: match[1] === "commands" ? "Command" : "Query",
    kind: match[3],
  };
}

const noAggregatedAdapters = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      pluralFile:
        "Adapters must be one class per *.adapter.ts file; aggregated *.adapters.ts files are forbidden.",
      multipleClasses: "An adapter file must contain at most one adapter class.",
      multiplePorts: "An adapter class must implement at most one port.",
    },
  },
  create(context) {
    const filename = context.getFilename()
      .replaceAll("\\", "/");

    const classes = [];

    if (!isAdapterFile(filename)) {
      return {};
    }

    return {
      Program(node) {
        if (filename.endsWith(".adapters.ts")) {
          context.report({ node, messageId: "pluralFile" });
        }
      },
      ClassDeclaration(node) {
        classes.push(node);

        if (node.implements?.length > 1) {
          context.report({ node, messageId: "multiplePorts" });
        }
      },
      "Program:exit": function (node) {
        if (classes.length > 1) {
          context.report({ node, messageId: "multipleClasses" });
        }
      },
    };
  },
};

const oneClassPerFile = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      multipleClasses:
        "Implementation files may declare only one class; extract each class into its own file.",
    },
  },
  create(context) {
    const filename = context.getFilename()
      .replaceAll("\\", "/");

    if (
      !filename.includes("/packages/") ||
      /(?:\.test|\.spec|\.config|\.setup|\.tool|\.operator)\.(?:ts|tsx)$/.test(filename)
    ) {
      return {};
    }

    let count = 0;

    return {
      ClassDeclaration() {
        count += 1;
      },
      ClassExpression() {
        count += 1;
      },
      "Program:exit": (node) => {
        if (count > 1) {
          context.report({ node, messageId: "multipleClasses" });
        }
      },
    };
  },
};

const oneInterfacePerFile = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      multipleInterfaces:
        "Contract files may declare only one interface; extract each interface into its own file.",
    },
  },
  create(context) {
    const filename = context.getFilename()
      .replaceAll("\\", "/");

    if (
      !filename.includes("/packages/") ||
      /(?:\.test|\.spec|\.config|\.setup|\.tool|\.operator)\.(?:ts|tsx)$/.test(filename)
    ) {
      return {};
    }

    let count = 0;

    return {
      TSInterfaceDeclaration() {
        count += 1;
      },
      "Program:exit": (node) => {
        if (count > 1) {
          context.report({ node, messageId: "multipleInterfaces" });
        }
      },
    };
  },
};

const oneTypePerFile = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      multipleTypes:
        "Contract files may declare only one type alias; extract each type into its own file.",
    },
  },
  create(context) {
    const filename = context.getFilename()
      .replaceAll("\\", "/");

    if (
      !filename.includes("/packages/") ||
      /(?:\.test|\.spec|\.config|\.setup|\.tool|\.operator)\.(?:ts|tsx)$/.test(filename)
    ) {
      return {};
    }

    let count = 0;

    return {
      TSTypeAliasDeclaration() {
        count += 1;
      },
      "Program:exit": (node) => {
        if (count > 1) {
          context.report({ node, messageId: "multipleTypes" });
        }
      },
    };
  },
};

const cqrsFileContract = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      legacyUseCase:
        "Generic *.use-case.ts files are forbidden; split the use case into Command/Query, Handler and Result files.",
      missingCommand: "A CQRS command file must declare {{name}}Command.",
      missingQuery: "A CQRS query file must declare {{name}}Query.",
      missingResult: "A CQRS result file must declare {{name}}Result.",
      missingHandler: "A CQRS handler file must declare {{name}}Handler.",
      multipleClasses: "A CQRS handler file must contain exactly one class.",
      missingExecute: "Every CQRS handler class must expose execute().",
      invalidFileName: "CQRS files must use command/query, handler and result type suffixes.",
    },
  },
  create(context) {
    const filename = context.getFilename()
      .replaceAll("\\", "/");

    const isCqrsBarrel = /\/packages\/pkg-application\/src\/(commands|queries)\/index\.ts$/.test(
      filename,
    );

    const contract = getCqrsFile(filename);

    const declarations = new Set();

    const classes = [];

    return {
      Program(node) {
        if (/\/packages\/pkg-application\/src\/use-cases\/[^/]+\.use-case\.ts$/.test(filename)) {
          context.report({ node, messageId: "legacyUseCase" });

          return;
        }

        if (
          filename.includes("/packages/pkg-application/src/commands/") ||
          filename.includes("/packages/pkg-application/src/queries/") ||
          filename.includes("/packages/pkg-application/src/use-cases/")
        ) {
          if (!contract && !isCqrsBarrel) {
            context.report({ node, messageId: "invalidFileName" });
          }
        }
      },
      TSInterfaceDeclaration(node) {
        declarations.add(node.id.name);
      },
      TSTypeAliasDeclaration(node) {
        declarations.add(node.id.name);
      },
      ClassDeclaration(node) {
        declarations.add(node.id?.name);

        classes.push(node);
      },
      "Program:exit": function (node) {
        if (!contract) {
          return;
        }

        const expectedPrefix = `${contract.operation}${contract.family}`;

        if (contract.kind === "command" || contract.kind === "query") {
          const expected = `${expectedPrefix}`;

          if (!declarations.has(expected)) {
            context.report({
              node,
              messageId: contract.family === "Command" ? "missingCommand" : "missingQuery",
              data: { name: contract.operation },
            });
          }
        }

        if (contract.kind === "command-result" || contract.kind === "query-result") {
          const expected = `${expectedPrefix}Result`;

          if (!declarations.has(expected)) {
            context.report({ node, messageId: "missingResult", data: { name: expectedPrefix } });
          }
        }

        if (contract.kind === "command-handler" || contract.kind === "query-handler") {
          const expected = `${expectedPrefix}Handler`;

          const handler = classes.find((item) => {
            return item.id?.name === expected;
          });

          if (!handler) {
            context.report({ node, messageId: "missingHandler", data: { name: expectedPrefix } });
          }

          if (classes.length !== 1) {
            context.report({ node, messageId: "multipleClasses" });
          }

          if (
            handler &&
            !handler.body.body.some((item) => {
              return isClassMethodNamed(item, "execute");
            })
          ) {
            context.report({ node: handler, messageId: "missingExecute" });
          }
        }
      },
    };
  },
};

const allowedLayerDependencies = {
  domain: new Set(["domain"]),
  application: new Set([
    "application",
    "application-commands",
    "application-queries",
    "application-ports",
    "domain",
  ]),
  "application-commands": new Set([
    "application",
    "application-commands",
    "application-ports",
    "domain",
  ]),
  "application-queries": new Set([
    "application",
    "application-queries",
    "application-ports",
    "domain",
  ]),
  "application-ports": new Set(["application", "application-ports", "domain"]),
  adapter: new Set(["adapter", "application", "domain"]),
  ui: new Set(["ui"]),
  "ui-content": new Set(["ui-content", "ui", "application"]),
  "app-composition": new Set([
    "app-composition",
    "app-presentation",
    "application",
    "application-commands",
    "application-queries",
    "application-ports",
    "adapter",
    "ui",
    "ui-content",
  ]),
  "app-presentation": new Set([
    "app-composition",
    "app-presentation",
    "application",
    "application-commands",
    "application-queries",
    "ui",
    "ui-content",
  ]),
  utils: new Set(["utils"]),
  tooling: new Set(["tooling", "adapter", "application", "domain"]),
  config: new Set(["config", "tooling"]),
  data: new Set(["data"]),
};

export function isDisallowedLayerDependency(origin, target) {
  if (!origin || !target || target === "unknown-workspace") {
    return false;
  }

  return !allowedLayerDependencies[origin]?.has(target);
}

const layerBoundaries = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      unknownWorkspace:
        "Workspace dependency {{source}} does not resolve to a declared package layer.",
      forbidden: "{{origin}} cannot depend on {{target}} through {{source}}.",
    },
  },
  create(context) {
    return createModuleReferenceVisitors(
      context,
      ({ context: ruleContext, node, source, layer, target }) => {
        if (!layer || (!target && !source.startsWith("."))) {
          return;
        }

        if (target === "unknown-workspace") {
          ruleContext.report({ node, messageId: "unknownWorkspace", data: { source } });

          return;
        }

        if (isDisallowedLayerDependency(layer, target)) {
          ruleContext.report({
            node,
            messageId: "forbidden",
            data: { origin: layer, target, source },
          });
        }
      },
    );
  },
};

export function reportForbiddenImport({ context, forbiddenImports, node, source }) {
  if (
    forbiddenImports.some((pattern) => {
      return pattern.test(source);
    })
  ) {
    context.report({ node, messageId: "forbidden", data: { source } });
  }
}

export function createPurityRule({ name, message, layers, forbiddenImports, allowExternal }) {
  return {
    meta: {
      type: "problem",
      schema: [],
      messages: { forbidden: message },
    },
    create(context) {
      return createModuleReferenceVisitors(context, ({ node, source, layer, filename }) => {
        if (layers.has(layer)) {
          if (isExternalModuleSource(source) && !allowExternal(source, filename)) {
            context.report({ node, messageId: "forbidden", data: { source } });

            return;
          }

          reportForbiddenImport({ context, forbiddenImports, node, source });
        }
      });
    },
    name,
  };
}

const applicationPurity = createPurityRule({
  name: "application-purity",
  layers: applicationLayers,
  forbiddenImports: forbiddenApplicationImports,
  allowExternal: (source, filename) => {
    return isTestFilename(filename) && /^(?:vitest|node:test)$/.test(source);
  },
  message:
    "Application code must remain technology-independent; move presentation, persistence and browser dependencies behind ports and adapters.",
});

const domainPurity = createPurityRule({
  name: "domain-purity",
  layers: new Set(["domain"]),
  forbiddenImports: forbiddenDomainImports,
  allowExternal: (source, filename) => {
    return (
      /^date-fns(?:\/|$)/.test(source) ||
      (isTestFilename(filename) && /^(?:vitest|node:test)$/.test(source))
    );
  },
  message:
    "Domain code must remain pure and independent of presentation, persistence, browser APIs and infrastructure.",
});

const noDomainInPresentation = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      forbidden:
        "Presentation must consume application read models and contracts instead of importing the domain directly.",
    },
  },
  create(context) {
    return createModuleReferenceVisitors(context, ({ node, target, layer }) => {
      if (["app-presentation", "ui-content"].includes(layer) && target === "domain") {
        context.report({ node, messageId: "forbidden" });
      }
    });
  },
};

const noAdapterCrossImport = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      forbidden:
        "An adapter cannot import another adapter implementation; depend on an application port instead.",
    },
  },
  create(context) {
    const filename = normalizeFilename(context.getFilename());

    const originAdapter = filename.match(/\/packages\/(pkg-adapter-[^/]+)\//)?.[1];

    if (!originAdapter) {
      return {};
    }

    return createModuleReferenceVisitors(context, ({ node, source }) => {
      const targetPackage = getPackagePathFromSpecifier(source)
        ?.split("/")
        .at(1);

      if (
        targetPackage &&
        targetPackage !== originAdapter &&
        targetPackage.startsWith("pkg-adapter-")
      ) {
        context.report({ node, messageId: "forbidden" });

        return;
      }

      if (source.startsWith(".")) {
        const target = getRelativeTargetFilename(filename, source);

        const targetAdapter = target.match(/\/packages\/(pkg-adapter-[^/]+)\//)?.[1];

        if (targetAdapter && targetAdapter !== originAdapter) {
          context.report({ node, messageId: "forbidden" });
        }
      }
    });
  },
};

const compositionRoot = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      import: "Concrete adapters may only be imported by packages/app/src/composition.",
      instantiate:
        "Concrete adapter classes may only be instantiated by packages/app/src/composition.",
    },
  },
  create(context) {
    const filename = normalizeFilename(context.getFilename());

    const sourceLayer = getSourceLayer(filename);

    const isComposition = sourceLayer === "app-composition";

    if (sourceLayer === "tooling") {
      return {};
    }

    const originAdapter = getAdapterPackageFromFilename(filename);

    const importedAdapters = new Set();

    return {
      ...createModuleReferenceVisitors(context, ({ node, source, target }) => {
        if (target !== "adapter") {
          return;
        }

        const targetAdapter = getAdapterPackageFromSource(filename, source);

        const isInternalAdapterImport = Boolean(
          originAdapter && targetAdapter && originAdapter === targetAdapter,
        );

        if (node.type === "ImportDeclaration") {
          if (!isInternalAdapterImport) {
            for (const specifier of node.specifiers) {
              importedAdapters.add(specifier.local.name);
            }
          }
        }

        if (!isComposition && !isInternalAdapterImport) {
          context.report({ node, messageId: "import" });
        }
      }),
      NewExpression(node) {
        if (isComposition || node.callee.type !== "Identifier") {
          return;
        }

        if (importedAdapters.has(node.callee.name)) {
          context.report({ node, messageId: "instantiate" });
        }
      },
    };
  },
};

const cqrsLayerBoundaries = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      commandQuery: "Commands and queries must not depend on each other.",
      portHandler:
        "Ports define application contracts and must not depend on handlers or concrete adapters.",
      presentationPort:
        "Presentation must use application queries and commands instead of importing ports directly.",
    },
  },
  create(context) {
    const origin = getSourceLayer(context.getFilename());

    return createModuleReferenceVisitors(context, ({ node, target }) => {
      if (origin === "application-commands" && target === "application-queries") {
        context.report({ node, messageId: "commandQuery" });
      }

      if (origin === "application-queries" && target === "application-commands") {
        context.report({ node, messageId: "commandQuery" });
      }

      if (
        origin === "application-ports" &&
        [
          "application-commands",
          "application-queries",
          "adapter",
          "app-presentation",
          "ui",
          "ui-content",
        ].includes(target)
      ) {
        context.report({ node, messageId: "portHandler" });
      }

      if (origin === "app-presentation" && target === "application-ports") {
        context.report({ node, messageId: "presentationPort" });
      }
    });
  },
};

const mvvmLayerBoundaries = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      viewModelComponent:
        "View models coordinate application state and must not import or render presentation components.",
      infrastructurePresentation:
        "Domain, application and adapters must not depend on presentation components or hooks.",
    },
  },
  create(context) {
    const filename = normalizeFilename(context.getFilename());

    const origin = getSourceLayer(filename);

    const isViewModel = /(?:\.view-model|\.view-model\.hook)\.(?:ts|tsx)$/.test(filename);

    return {
      ...createModuleReferenceVisitors(context, ({ node, source }) => {
        if (
          isViewModel &&
          source.startsWith(".") &&
          /(?:\.component|\.view)(?:\.(?:ts|tsx))?$/.test(source)
        ) {
          context.report({ node, messageId: "viewModelComponent" });
        }

        if (
          [
            "domain",
            "application",
            "application-commands",
            "application-queries",
            "application-ports",
            "adapter",
          ].includes(origin) &&
          source.startsWith(".") &&
          /(?:\.component|\.view|\.hook)(?:\.(?:ts|tsx))?$/.test(source)
        ) {
          context.report({ node, messageId: "infrastructurePresentation" });
        }
      }),
      JSXElement(node) {
        if (isViewModel) {
          context.report({ node, messageId: "viewModelComponent" });
        }
      },
      JSXFragment(node) {
        if (isViewModel) {
          context.report({ node, messageId: "viewModelComponent" });
        }
      },
    };
  },
};

const portContract = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      interface: "A .port.ts file must declare exactly one explicit interface ending in Port.",
      execute: "Every port must expose execute().",
      implementation: "A port file may declare a contract only; move implementation to an adapter.",
    },
  },
  create(context) {
    const filename = normalizeFilename(context.getFilename());

    if (!/\/packages\/pkg-application\/src\/ports\/[^/]+\.port\.ts$/.test(filename)) {
      return {};
    }

    const interfaces = [];

    return {
      TSInterfaceDeclaration(node) {
        interfaces.push(node);
      },
      ClassDeclaration(node) {
        context.report({ node, messageId: "implementation" });
      },
      FunctionDeclaration(node) {
        context.report({ node, messageId: "implementation" });
      },
      "Program:exit": function (node) {
        if (interfaces.length !== 1 || !interfaces[0].id.name.endsWith("Port")) {
          context.report({ node, messageId: "interface" });

          return;
        }

        const hasExecute = interfaces[0].body.body.some((member) => {
          return (
            (member.type === "TSMethodSignature" || member.type === "TSPropertySignature") &&
            member.key.type === "Identifier" &&
            member.key.name === "execute"
          );
        });

        if (!hasExecute) {
          context.report({ node: interfaces[0], messageId: "execute" });
        }
      },
    };
  },
};

const adapterContract = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      class: "An adapter file must declare exactly one class ending in Adapter.",
      port: "An adapter must implement exactly one application port.",
    },
  },
  create(context) {
    const filename = normalizeFilename(context.getFilename());

    if (!/\/packages\/pkg-adapter-[^/]+\/src\/.*\.adapter\.ts$/.test(filename)) {
      return {};
    }

    const classes = [];

    return {
      ClassDeclaration(node) {
        classes.push(node);
      },
      "Program:exit": function (node) {
        if (classes.length !== 1 || !classes[0].id?.name.endsWith("Adapter")) {
          context.report({ node, messageId: "class" });

          return;
        }

        const implementedPorts = classes[0].implements?.filter((item) => {
          return item.expression?.type === "Identifier" && item.expression.name.endsWith("Port");
        });

        if (implementedPorts?.length !== 1) {
          context.report({ node: classes[0], messageId: "port" });
        }
      },
    };
  },
};

const adapterDependencyInjection = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      constructor:
        "Adapters must receive concrete dependencies from the composition root; do not instantiate dependencies in constructors.",
    },
  },
  create(context) {
    const filename = normalizeFilename(context.getFilename());

    if (!/\/packages\/pkg-adapter-[^/]+\/src\/.*\.adapter\.ts$/.test(filename)) {
      return {};
    }

    return {
      NewExpression(node) {
        const ancestors = context.sourceCode.getAncestors(node);

        const hasConstructorAncestor = ancestors.some((ancestor) => {
          return ancestor.type === "MethodDefinition" && ancestor.kind === "constructor";
        });

        if (hasConstructorAncestor) {
          context.report({ node, messageId: "constructor" });
        }
      },
    };
  },
};

const constructorDependencyInversion = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      constructor:
        "Constructors may receive contracts only; provide concrete implementations from the composition root.",
      implementation:
        "A constructor parameter must use a contract instead of a concrete adapter, repository, store, database, client or service.",
    },
  },
  create(context) {
    const filename = normalizeFilename(context.getFilename());

    if (!filename.includes("/packages/") || isTestFilename(filename)) {
      return {};
    }

    const importedImplementations = new Set();

    const importedImplementationNamespaces = new Set();

    const isConcreteName = (name) => {
      return (
        /(?:Adapter|Repository|Store|Database|Client|Service)$/.test(name) &&
        !/(?:Contract|Port)$/.test(name)
      );
    };

    const containsImportedImplementation = (node, sourceCode) => {
      if (!node || typeof node !== "object") {
        return false;
      }

      if (node.type === "TSTypeReference") {
        const { typeName } = node;

        if (
          typeName.type === "Identifier" &&
          (importedImplementations.has(typeName.name) || isConcreteName(typeName.name))
        ) {
          return true;
        }

        if (
          typeName.type === "TSQualifiedName" &&
          typeName.left.type === "Identifier" &&
          typeName.right.type === "Identifier" &&
          importedImplementationNamespaces.has(typeName.left.name) &&
          isConcreteName(typeName.right.name)
        ) {
          return true;
        }
      }

      return (sourceCode.visitorKeys[node.type] || []).some((key) => {
        const value = node[key];

        return Array.isArray(value)
          ? value.some((child) => {
            return containsImportedImplementation(child, sourceCode);
          })
          : containsImportedImplementation(value, sourceCode);
      });
    };

    return {
      ImportDeclaration(node) {
        if (getTargetLayer(filename, getStaticModuleSource(node.source)) !== "adapter") {
          return;
        }

        for (const specifier of node.specifiers) {
          if (specifier.type === "ImportNamespaceSpecifier") {
            importedImplementationNamespaces.add(specifier.local.name);
          }

          const importedName = specifier.imported?.name || specifier.local.name;

          if (isConcreteName(importedName)) {
            importedImplementations.add(specifier.local.name);
          }
        }
      },
      NewExpression(node) {
        const ancestors = context.sourceCode.getAncestors(node);

        const hasConstructorAncestor = ancestors.some((ancestor) => {
          return (
            ["ClassMethod", "MethodDefinition"].includes(ancestor.type) &&
            ancestor.kind === "constructor"
          );
        });

        if (hasConstructorAncestor) {
          context.report({ node, messageId: "constructor" });
        }
      },
      MethodDefinition(node) {
        if (node.kind !== "constructor") {
          return;
        }

        for (const parameter of node.value.params) {
          if (containsImportedImplementation(parameter, context.sourceCode)) {
            context.report({ node: parameter, messageId: "implementation" });
          }
        }
      },
      ClassMethod(node) {
        if (node.kind !== "constructor") {
          return;
        }

        for (const parameter of node.params) {
          if (containsImportedImplementation(parameter, context.sourceCode)) {
            context.report({ node: parameter, messageId: "implementation" });
          }
        }
      },
    };
  },
};

const noLowLevelLayoutOutsideUi = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      component: "Low-level layout components are only allowed inside the UI package.",
      prop: "Low-level layout props are only allowed inside the UI package.",
    },
  },
  create(context) {
    if (getSourceLayer(context.getFilename()) !== "app-presentation") {
      return {};
    }

    const forbiddenComponents = new Set(["Box", "Container", "Grid", "Stack"]);

    const forbiddenProps = new Set([
      "alignContent",
      "alignItems",
      "alignSelf",
      "columnGap",
      "columnSpacing",
      "direction",
      "flexDirection",
      "flexWrap",
      "gap",
      "gridTemplateColumns",
      "gridTemplateRows",
      "justifyContent",
      "justifyItems",
      "justifySelf",
      "rowGap",
      "rowSpacing",
      "spacing",
      "sx",
      "style",
    ]);

    const importedComponents = new Set();

    return {
      ImportDeclaration(node) {
        if (getStaticModuleSource(node.source) !== "@guesant/saberes-ui") {
          return;
        }

        for (const specifier of node.specifiers) {
          if (
            specifier.type === "ImportSpecifier" &&
            forbiddenComponents.has(specifier.imported.name)
          ) {
            importedComponents.add(specifier.local.name);
          }
        }
      },
      JSXOpeningElement(node) {
        if (node.name.type === "JSXIdentifier" && importedComponents.has(node.name.name)) {
          context.report({ node: node.name, messageId: "component" });
        }

        for (const attribute of node.attributes) {
          if (
            attribute.type === "JSXAttribute" &&
            attribute.name.type === "JSXIdentifier" &&
            forbiddenProps.has(attribute.name.name)
          ) {
            context.report({ node: attribute.name, messageId: "prop" });
          }
        }
      },
    };
  },
};

const uiComponentPrefix = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      component:
        "Public UI components must use the UI prefix (for example, UIButton or UIContentRenderer).",
      props: "Public UI component props types must use the UI prefix.",
    },
  },
  create(context) {
    const layer = getSourceLayer(context.getFilename());

    if (!new Set(["ui", "ui-content"])
      .has(layer)) {
      return {};
    }

    const { kind } = getFileDescriptor(normalizeFilename(context.getFilename()));

    const isUiComponentFile = kind === "component";

    const isExported = (node) => {
      return node.parent?.type === "ExportNamedDeclaration";
    };

    const isComponentFunction = (node) => {
      return ["FunctionDeclaration", "FunctionExpression", "ArrowFunctionExpression"].includes(
        node.type,
      );
    };

    return {
      FunctionDeclaration(node) {
        if (
          isExported(node) &&
          isUiComponentFile &&
          isComponentFunction(node) &&
          node.id?.name !== "createTheme" &&
          !node.id.name.startsWith("UI")
        ) {
          context.report({ node: node.id, messageId: "component" });
        }
      },
      VariableDeclarator(node) {
        if (
          node.id.type === "Identifier" &&
          isExported(node.parent?.parent) &&
          isUiComponentFile &&
          isComponentFunction(node.init) &&
          !node.id.name.startsWith("UI")
        ) {
          context.report({ node: node.id, messageId: "component" });
        }
      },
      TSInterfaceDeclaration(node) {
        if (isExported(node) && node.id.name.endsWith("Props") && !node.id.name.startsWith("UI")) {
          context.report({ node: node.id, messageId: "props" });
        }
      },
      TSTypeAliasDeclaration(node) {
        if (isExported(node) && node.id.name.endsWith("Props") && !node.id.name.startsWith("UI")) {
          context.report({ node: node.id, messageId: "props" });
        }
      },
    };
  },
};

export default {
  meta: { name: "portal-guesant-saberes-architecture", version: "1.0.0" },
  rules: {
    "component-props-contract": componentPropsContract,
    "conditional-rendering-delegation": conditionalRenderingDelegation,
    "map-to-imported-component": mapToImportedComponent,
    "no-complex-inline-handler": noComplexInlineHandler,
    "no-class-component": noClassComponent,
    "no-sql-outside-repository": noSqlOutsideRepository,
    "no-explicit-any": noExplicitAny,
    "no-generic-identifiers": noGenericIdentifiers,
    "no-generic-props-type-name": noGenericPropsTypeName,
    "no-inline-object-type-in-parameters": noInlineObjectTypeInParameters,
    "no-anonymous-complex-types": noAnonymousComplexTypes,
    "max-function-parameters": maxFunctionParameters,
    "no-mui-reexport": noMuiReexport,
    "wildcard-reexports-only": wildcardReexportsOnlyInIndex,
    "no-named-reexports": noNamedReexports,
    "no-parent-reexports": noParentReexports,
    "execute-single-parameter": executeSingleParameter,
    "no-unsafe-double-cast": noUnsafeDoubleCast,
    "no-forbidden-type-casts": noForbiddenTypeCasts,
    "no-unjustified-suppression": noUnjustifiedSuppression,
    "no-visual-props-outside-ui": noVisualPropsOutsideUi,
    "no-aggregated-adapters": noAggregatedAdapters,
    "one-class-per-file": oneClassPerFile,
    "one-interface-per-file": oneInterfacePerFile,
    "one-type-per-file": oneTypePerFile,
    "cqrs-file-contract": cqrsFileContract,
    "domain-function-purity": domainFunctionPurity,
    "domain-functions-in-domain-package": domainFunctionsInDomainPackage,
    "one-exported-function-per-file": oneExportedFunctionPerFile,
    "one-function-per-file": oneFunctionPerFile,
    "padding-around-type-statements": paddingAroundTypeStatements,
    "purposeful-naming": purposefulNaming,
    "utils-module-boundary": utilsModuleBoundary,
    "layer-boundaries": layerBoundaries,
    "composition-root": compositionRoot,
    "no-domain-in-presentation": noDomainInPresentation,
    "no-adapter-cross-import": noAdapterCrossImport,
    "application-purity": applicationPurity,
    "domain-purity": domainPurity,
    "cqrs-layer-boundaries": cqrsLayerBoundaries,
    "mvvm-layer-boundaries": mvvmLayerBoundaries,
    "port-contract": portContract,
    "adapter-contract": adapterContract,
    "adapter-dependency-injection": adapterDependencyInjection,
    "constructor-dependency-inversion": constructorDependencyInversion,
    "no-low-level-layout-outside-ui": noLowLevelLayoutOutsideUi,
    "ui-component-prefix": uiComponentPrefix,
    "file-name-contract": fileNameContract,
    "file-kind-location": fileKindLocation,
    "file-kind-contract": fileKindContract,
  },
};
