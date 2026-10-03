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

function normalizedFilename(filename) {
  return filename.replaceAll("\\", "/");
}

function sourceLayer(filename) {
  const normalized = normalizedFilename(filename);

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

  if (/(?:^|\/)\.tools\//.test(normalized)) {
    return "tooling";
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

function packagePathFromSpecifier(source) {
  for (const [specifier, packagePath] of workspacePackagePaths) {
    if (source === specifier || source.startsWith(`${specifier}/`)) {
      return packagePath;
    }
  }

  return undefined;
}

function isWorkspaceModuleSource(source) {
  return Boolean(packagePathFromSpecifier(source)) || source.startsWith("@guesant/saberes-");
}

function isTestFilename(filename) {
  return /(?:\.test|\.spec)\.(?:js|jsx|mjs|ts|tsx)$/.test(filename);
}

function isExternalModuleSource(source) {
  return !source.startsWith(".") && !isWorkspaceModuleSource(source);
}

function relativeTargetFilename(filename, source) {
  if (!source.startsWith(".")) {
    return undefined;
  }

  return resolve(dirname(filename), source).replaceAll("\\", "/");
}

function targetLayer(filename, source) {
  for (const [specifier, packagePath] of workspacePackagePaths) {
    if (source === specifier || source.startsWith(`${specifier}/`)) {
      const internalPath = source.slice(specifier.length).replace(/^\//, "");

      const targetPath = internalPath
        ? resolve(process.cwd(), packagePath, "src", internalPath)
        : resolve(process.cwd(), packagePath, "src/index.ts");

      return sourceLayer(targetPath);
    }
  }

  if (source.startsWith("@guesant/saberes-")) {
    return "unknown-workspace";
  }

  if (source.startsWith(".")) {
    return sourceLayer(relativeTargetFilename(filename, source));
  }

  return undefined;
}

function staticModuleSource(node) {
  if (node?.type === "Literal" && typeof node.value === "string") {
    return node.value;
  }

  if (node?.type === "StringLiteral") {
    return node.value;
  }

  return undefined;
}

function moduleReferenceVisitors(context, visit) {
  const filename = normalizedFilename(context.getFilename());

  function inspect(node, sourceNode) {
    const source = staticModuleSource(sourceNode);

    if (source) {
      visit({
        context,
        filename,
        node,
        source,
        layer: sourceLayer(filename),
        target: targetLayer(filename, source),
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

function isJsx(node) {
  return Boolean(node && (node.type === "JSXElement" || node.type === "JSXFragment"));
}

function containsJsx(node, sourceCode) {
  if (!node || typeof node !== "object") {
    return false;
  }

  if (isJsx(node)) {
    return true;
  }

  return (sourceCode.visitorKeys[node.type] || []).some((key) => {
    const value = node[key];

    return Array.isArray(value)
      ? value.some((child) => containsJsx(child, sourceCode))
      : containsJsx(value, sourceCode);
  });
}

function containsControlFlow(node, sourceCode) {
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
      ? value.some((child) => containsControlFlow(child, sourceCode))
      : containsControlFlow(value, sourceCode);
  });
}

function unwrapExpression(node) {
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

function callbackExpression(callback) {
  if (callback.type === "ArrowFunctionExpression" && callback.body.type !== "BlockStatement") {
    return unwrapExpression(callback.body);
  }

  if (callback.body?.type === "BlockStatement") {
    const statements = callback.body.body.filter(
      (statement) => statement.type !== "EmptyStatement",
    );

    if (statements.length !== 1 || statements[0].type !== "ReturnStatement") {
      return undefined;
    }

    return unwrapExpression(statements[0].argument);
  }

  return undefined;
}

function isImportedSelfClosingComponent(expression, importedBindings) {
  const node = unwrapExpression(expression);

  return Boolean(
    node?.type === "JSXElement" &&
    node.openingElement.selfClosing &&
    node.openingElement.name.type === "JSXIdentifier" &&
    /^[A-Z]/.test(node.openingElement.name.name) &&
    importedBindings.has(node.openingElement.name.name),
  );
}

function isMapCall(node) {
  return (
    node.callee?.type === "MemberExpression" &&
    !node.callee.computed &&
    node.callee.property.type === "Identifier" &&
    node.callee.property.name === "map"
  );
}

function collectImports(node) {
  const bindings = new Set();

  for (const specifier of node.specifiers) {
    bindings.add(specifier.local.name);
  }

  return bindings;
}

function componentName(node) {
  if (node.type === "FunctionDeclaration") {
    return node.id?.name;
  }

  return node.parent?.type === "VariableDeclarator" && node.parent.id.type === "Identifier"
    ? node.parent.id.name
    : undefined;
}

function isTopLevel(node) {
  let current = node.parent;

  while (
    current &&
    ["ExportNamedDeclaration", "VariableDeclarator", "VariableDeclaration"].includes(current.type)
  ) {
    current = current.parent;
  }

  return current?.type === "Program";
}

function isTopLevelFunction(node) {
  return (
    ["FunctionDeclaration", "FunctionExpression", "ArrowFunctionExpression"].includes(node.type) &&
    isTopLevel(node)
  );
}

function isExportedFunction(node) {
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
      ].includes(current.type)
    ) {
      return false;
    }

    current = current.parent;
  }

  return false;
}

function functionPolicyIgnored(filename) {
  return (
    !filename.includes("/packages/") ||
    /(?:\.test|\.spec|\.config|\.setup|\.tool|\.operator)\.(?:ts|tsx)$/.test(filename) ||
    /\/index\.(?:ts|tsx)$/.test(filename) ||
    /\.d\.ts$/.test(filename)
  );
}

function functionDeclarationName(node) {
  if (node.type === "FunctionDeclaration") {
    return node.id?.name;
  }

  return node.parent?.type === "VariableDeclarator" && node.parent.id.type === "Identifier"
    ? node.parent.id.name
    : undefined;
}

function startsWithPurposeVerb(name) {
  const verbs = [
    "act",
    "action",
    "add",
    "build",
    "calculate",
    "check",
    "clear",
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
    "generate",
    "get",
    "handle",
    "has",
    "import",
    "list",
    "load",
    "map",
    "normalize",
    "open",
    "parse",
    "preview",
    "read",
    "recommend",
    "record",
    "reduce",
    "register",
    "reload",
    "remove",
    "render",
    "replace",
    "resolve",
    "revive",
    "run",
    "save",
    "schedule",
    "select",
    "serialize",
    "set",
    "should",
    "start",
    "stop",
    "submit",
    "suggest",
    "sync",
    "transform",
    "update",
    "use",
    "validate",
    "write",
  ];

  return verbs.some(
    (verb) => name === verb || (name.startsWith(verb) && /^[A-Z]/.test(name.slice(verb.length))),
  );
}

function classSuffix(filename) {
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

function contractSuffix(filename) {
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

function isReactComponentFunction(node, sourceCode) {
  const name = componentName(node);

  return Boolean(name && /^[A-Z]/.test(name) && containsJsx(node.body, sourceCode));
}

function typeName(parameter) {
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

      const expected = `${componentName(node)}Props`;

      const actual = typeName(parameter);

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

        if (!isImportedSelfClosingComponent(callbackExpression(callback), importedBindings)) {
          context.report({ node, messageId: "invalidMap" });
        }
      },
    };
  },
};

function unwrapBranch(node) {
  const current = unwrapExpression(node);

  if (current?.type === "ReturnStatement" || current?.type === "ExpressionStatement") {
    return unwrapBranch(current.argument || current.expression);
  }

  if (current?.type === "BlockStatement") {
    const statements = current.body.filter((statement) => statement.type !== "EmptyStatement");

    return statements.length === 1 ? unwrapBranch(statements[0]) : current;
  }

  return current;
}

function isInsideComponent(node, sourceCode) {
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
    const filename = context.getFilename().replaceAll("\\", "/");

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
                .map((rule) => rule.trim())
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
    schema: [],
    messages: {
      multipleFunctions:
        "Production files may declare only one top-level function; extract each function into its own file.",
      notExported: "Top-level production functions must be exported.",
    },
  },
  create(context) {
    const filename = context.getFilename().replaceAll("\\", "/");

    const functions = [];

    if (functionPolicyIgnored(filename)) {
      return {};
    }

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
          if (!isExportedFunction(functionNode)) {
            context.report({ node: functionNode, messageId: "notExported" });
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
      classSuffix:
        "Classes in this file must end with {{suffix}} to match the file responsibility.",
      contractCase: "Interfaces and type aliases must use PascalCase.",
      contractSuffix:
        "Interfaces and type aliases in this file must end with one of: {{suffixes}}.",
    },
  },
  create(context) {
    const filename = context.getFilename().replaceAll("\\", "/");

    const { sourceCode } = context;

    if (functionPolicyIgnored(filename)) {
      return {};
    }

    const viewModelFile = filename.endsWith(".view-model.ts");

    const requiredClassSuffix = classSuffix(filename);

    const requiredContractSuffixes = contractSuffix(filename);

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
        !requiredContractSuffixes.some((suffix) => name.endsWith(suffix))
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
        reportFunctionName(node, functionDeclarationName(node));
      },
      FunctionExpression(node) {
        reportFunctionName(node, functionDeclarationName(node));
      },
      ArrowFunctionExpression(node) {
        reportFunctionName(node, functionDeclarationName(node));
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
    const filename = context.getFilename().replaceAll("\\", "/");

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
    const filename = context.getFilename().replaceAll("\\", "/");

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
        functionNode?.params.some(
          (parameter) => parameter.type === "Identifier" && parameter.name === node.name,
        ),
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
      FunctionDeclaration: (node) => functionStack.push(node),
      FunctionExpression: (node) => functionStack.push(node),
      ArrowFunctionExpression: (node) => functionStack.push(node),
      "FunctionDeclaration:exit": () => functionStack.pop(),
      "FunctionExpression:exit": () => functionStack.pop(),
      "ArrowFunctionExpression:exit": () => functionStack.pop(),
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
    const filename = context.getFilename().replaceAll("\\", "/");

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
        const fileName = context.getFilename().split(/[\\/]/).at(-1);

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

function isExecuteNode(node) {
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

      const restParameter = parameters.find((parameter) => parameter.type === "RestElement");

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

function isAdapterFile(filename) {
  return filename.includes("/packages/pkg-adapter-") && filename.includes("/src/adapters/");
}

function isClassMethodNamed(node, name) {
  return (
    ["ClassMethod", "MethodDefinition"].includes(node.type) &&
    ((node.key.type === "Identifier" && node.key.name === name) ||
      (node.key.type === "Literal" && node.key.value === name))
  );
}

function pascalCase(value) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
    .join("");
}

function cqrsFile(filename) {
  const match = filename.match(
    /\/packages\/pkg-application\/src\/(commands|queries|use-cases)\/([a-z0-9-]+)\.(command|command-handler|command-result|query|query-handler|query-result)\.ts$/,
  );

  if (!match) {
    return undefined;
  }

  return {
    operation: pascalCase(match[2]),
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
    const filename = context.getFilename().replaceAll("\\", "/");

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
    const filename = context.getFilename().replaceAll("\\", "/");

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
    const filename = context.getFilename().replaceAll("\\", "/");

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
    const filename = context.getFilename().replaceAll("\\", "/");

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
    const filename = context.getFilename().replaceAll("\\", "/");

    const isCqrsBarrel = /\/packages\/pkg-application\/src\/(commands|queries)\/index\.ts$/.test(
      filename,
    );

    const contract = cqrsFile(filename);

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

          const handler = classes.find((item) => item.id?.name === expected);

          if (!handler) {
            context.report({ node, messageId: "missingHandler", data: { name: expectedPrefix } });
          }

          if (classes.length !== 1) {
            context.report({ node, messageId: "multipleClasses" });
          }

          if (handler && !handler.body.body.some((item) => isClassMethodNamed(item, "execute"))) {
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
  tooling: new Set(["tooling"]),
  config: new Set(["config", "tooling"]),
  data: new Set(["data"]),
};

function isDisallowedLayerDependency(origin, target) {
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
    return moduleReferenceVisitors(
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

function reportForbiddenImport({ context, forbiddenImports, node, source }) {
  if (forbiddenImports.some((pattern) => pattern.test(source))) {
    context.report({ node, messageId: "forbidden", data: { source } });
  }
}

function purityRule({ name, message, layers, forbiddenImports, allowExternal }) {
  return {
    meta: {
      type: "problem",
      schema: [],
      messages: { forbidden: message },
    },
    create(context) {
      return moduleReferenceVisitors(context, ({ node, source, layer, filename }) => {
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

const applicationPurity = purityRule({
  name: "application-purity",
  layers: applicationLayers,
  forbiddenImports: forbiddenApplicationImports,
  allowExternal: (source, filename) =>
    isTestFilename(filename) && /^(?:vitest|node:test)$/.test(source),
  message:
    "Application code must remain technology-independent; move presentation, persistence and browser dependencies behind ports and adapters.",
});

const domainPurity = purityRule({
  name: "domain-purity",
  layers: new Set(["domain"]),
  forbiddenImports: forbiddenDomainImports,
  allowExternal: (source, filename) =>
    /^date-fns(?:\/|$)/.test(source) ||
    (isTestFilename(filename) && /^(?:vitest|node:test)$/.test(source)),
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
    return moduleReferenceVisitors(context, ({ node, target, layer }) => {
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
    const filename = normalizedFilename(context.getFilename());

    const originAdapter = filename.match(/\/packages\/(pkg-adapter-[^/]+)\//)?.[1];

    if (!originAdapter) {
      return {};
    }

    return moduleReferenceVisitors(context, ({ node, source }) => {
      const targetPackage = packagePathFromSpecifier(source)?.split("/").at(1);

      if (
        targetPackage &&
        targetPackage !== originAdapter &&
        targetPackage.startsWith("pkg-adapter-")
      ) {
        context.report({ node, messageId: "forbidden" });

        return;
      }

      if (source.startsWith(".")) {
        const target = relativeTargetFilename(filename, source);

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
    const filename = normalizedFilename(context.getFilename());

    const isComposition = sourceLayer(filename) === "app-composition";

    const importedAdapters = new Set();

    return {
      ...moduleReferenceVisitors(context, ({ node, target }) => {
        if (target !== "adapter") {
          return;
        }

        if (node.type === "ImportDeclaration") {
          for (const specifier of node.specifiers) {
            importedAdapters.add(specifier.local.name);
          }
        }

        if (!isComposition) {
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
    const origin = sourceLayer(context.getFilename());

    return moduleReferenceVisitors(context, ({ node, target }) => {
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
    const filename = normalizedFilename(context.getFilename());

    const origin = sourceLayer(filename);

    const isViewModel = /(?:\.view-model|\.view-model\.hook)\.(?:ts|tsx)$/.test(filename);

    return {
      ...moduleReferenceVisitors(context, ({ node, source }) => {
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
    const filename = normalizedFilename(context.getFilename());

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

        const hasExecute = interfaces[0].body.body.some(
          (member) =>
            (member.type === "TSMethodSignature" || member.type === "TSPropertySignature") &&
            member.key.type === "Identifier" &&
            member.key.name === "execute",
        );

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
    const filename = normalizedFilename(context.getFilename());

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

        const implementedPorts = classes[0].implements?.filter(
          (item) => item.expression?.type === "Identifier" && item.expression.name.endsWith("Port"),
        );

        if (implementedPorts?.length !== 1) {
          context.report({ node: classes[0], messageId: "port" });
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
    "max-function-parameters": maxFunctionParameters,
    "no-mui-reexport": noMuiReexport,
    "wildcard-reexports-only": wildcardReexportsOnlyInIndex,
    "no-named-reexports": noNamedReexports,
    "no-parent-reexports": noParentReexports,
    "execute-single-parameter": executeSingleParameter,
    "no-unsafe-double-cast": noUnsafeDoubleCast,
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
  },
};
