const protectedSourcePattern = /\/packages\/(?:app\/src|pkg-ui-content\/src)\//;

const styleAttributeNames = new Set(["class", "className", "css", "style", "sx"]);

const spacingPropertyNames = new Set([
  "columnGap",
  "columnSpacing",
  "gap",
  "margin",
  "marginBlock",
  "marginBlockEnd",
  "marginBlockStart",
  "marginBottom",
  "marginInline",
  "marginInlineEnd",
  "marginInlineStart",
  "marginLeft",
  "marginRight",
  "marginTop",
  "marginX",
  "marginY",
  "mb",
  "ml",
  "mr",
  "mt",
  "m",
  "my",
  "mx",
  "padding",
  "paddingBlock",
  "paddingBlockEnd",
  "paddingBlockStart",
  "paddingBottom",
  "paddingInline",
  "paddingInlineEnd",
  "paddingInlineStart",
  "paddingLeft",
  "paddingRight",
  "paddingTop",
  "paddingX",
  "paddingY",
  "pb",
  "pl",
  "pr",
  "pt",
  "p",
  "px",
  "py",
  "rowGap",
  "rowSpacing",
  "space",
  "spaceX",
  "spaceY",
  "spacing",
]);

const layoutPropertyNames = new Set([
  "alignContent",
  "alignItems",
  "alignSelf",
  "bottom",
  "display",
  "flex",
  "flexBasis",
  "flexDirection",
  "flexGrow",
  "flexShrink",
  "flexWrap",
  "grid",
  "gridArea",
  "gridAutoColumns",
  "gridAutoFlow",
  "gridAutoRows",
  "gridColumn",
  "gridColumnEnd",
  "gridColumnStart",
  "gridRow",
  "gridRowEnd",
  "gridRowStart",
  "gridTemplateAreas",
  "gridTemplateColumns",
  "gridTemplateRows",
  "height",
  "justifyContent",
  "justifyItems",
  "justifySelf",
  "left",
  "maxHeight",
  "maxWidth",
  "minHeight",
  "minWidth",
  "order",
  "overflow",
  "overflowX",
  "overflowY",
  "position",
  "right",
  "top",
  "transform",
  "width",
]);

const forbiddenStyleImports = new Set([
  "@emotion/react",
  "@emotion/styled",
  "styled-components",
  "tss-react",
]);

const styleFactoryNames = new Set(["createTheme", "makeStyles", "styled", "withStyles"]);

const semanticLayoutAttributes = new Map([["UIInputAdornment", new Set(["position"])]]);

function normalizeFilename(filename) {
  return filename.replaceAll("\\", "/");
}

function isProtectedFilename(filename) {
  return protectedSourcePattern.test(normalizeFilename(filename));
}

function getStaticPropertyName(node) {
  if (node.type === "PropertyDefinition" || node.type === "Property") {
    if (!node.computed && node.key.type === "Identifier") {
      return node.key.name;
    }

    if (node.key.type === "Literal" && typeof node.key.value === "string") {
      return node.key.value;
    }
  }

  return undefined;
}

function getJsxAttributeName(node) {
  return node.name.type === "JSXIdentifier" ? node.name.name : undefined;
}

function getJsxOpeningElementName(node) {
  const openingElement = node.parent?.type === "JSXOpeningElement" ? node.parent : undefined;

  return openingElement?.name.type === "JSXIdentifier" ? openingElement.name.name : undefined;
}

function isSemanticLayoutAttribute(node, name) {
  const elementName = getJsxOpeningElementName(node);

  return Boolean(elementName && semanticLayoutAttributes.get(elementName)
    ?.has(name));
}

function isObjectExpression(node) {
  return node?.type === "ObjectExpression";
}

function unwrapExpression(node) {
  let current = node;

  while (
    current &&
    ["ChainExpression", "ParenthesizedExpression", "TSAsExpression", "TSTypeAssertion"].includes(
      current.type,
    )
  ) {
    current = current.expression;
  }

  return current;
}

function getJsxExpression(node) {
  const value = node?.type === "JSXAttribute" ? node.value : node;

  return value?.type === "JSXExpressionContainer" ? unwrapExpression(value.expression) : undefined;
}

function getObjectPropertyNames(node) {
  const object = unwrapExpression(node);

  if (!isObjectExpression(object)) {
    return { names: [], inspectable: false };
  }

  const names = [];

  let inspectable = true;

  for (const property of object.properties) {
    if (property.type === "SpreadElement") {
      inspectable = false;

      continue;
    }

    const name = getStaticPropertyName(property);

    if (!name) {
      inspectable = false;

      continue;
    }

    names.push(name);
  }

  return { names, inspectable };
}

function reportStyleAttribute(context, node, messageId) {
  context.report({ node, messageId });
}

const noStyleDefinitionOutsideUi = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      attribute: "Style and class definitions are only allowed in the UI package.",
      spread: "Uninspectable props spreads are not allowed outside the UI package.",
      import: "Style imports are only allowed in the UI package.",
      factory: "Style factories are only allowed in the UI package.",
    },
  },
  create(context) {
    if (!isProtectedFilename(context.getFilename())) {
      return {};
    }

    return {
      ImportDeclaration(node) {
        const source = node.source.value;

        if (
          typeof source === "string" &&
          (forbiddenStyleImports.has(source) || /\.(?:css|scss|sass|less)$/.test(source))
        ) {
          reportStyleAttribute(context, node.source, "import");
        }
      },
      JSXAttribute(node) {
        const name = getJsxAttributeName(node);

        if (name && styleAttributeNames.has(name)) {
          reportStyleAttribute(context, node.name, "attribute");
        }
      },
      JSXSpreadAttribute(node) {
        reportStyleAttribute(context, node.argument, "spread");
      },
      CallExpression(node) {
        if (node.callee.type === "Identifier" && styleFactoryNames.has(node.callee.name)) {
          reportStyleAttribute(context, node.callee, "factory");
        }
      },
    };
  },
};

const noSpacingDefinitionOutsideUi = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      attribute: "Spacing and external spacing are owned by UI layout primitives.",
      object: "Spacing declarations are only allowed in UI layout primitives.",
      unknown: "Spacing declarations must be statically inspectable outside the UI package.",
    },
  },
  create(context) {
    if (!isProtectedFilename(context.getFilename())) {
      return {};
    }

    function inspectExpression(node) {
      const expression = unwrapExpression(node);

      const { names, inspectable } = getObjectPropertyNames(expression);

      if (!inspectable) {
        context.report({ node: expression || node, messageId: "unknown" });

        return;
      }

      for (const name of names) {
        if (spacingPropertyNames.has(name)) {
          context.report({ node: expression || node, messageId: "object" });
        }
      }
    }

    return {
      JSXAttribute(node) {
        const name = getJsxAttributeName(node);

        if (name && spacingPropertyNames.has(name)) {
          context.report({ node: node.name, messageId: "attribute" });

          return;
        }

        if (name === "sx" || name === "style") {
          inspectExpression(getJsxExpression(node));
        }
      },
    };
  },
};

const noLayoutDefinitionOutsideUi = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      attribute: "Layout geometry is owned by UI layout primitives.",
      object: "Layout geometry is only allowed in UI layout primitives.",
      unknown: "Layout declarations must be statically inspectable outside the UI package.",
      forbiddenValue: "Structural space-between and layout transforms are not allowed here.",
    },
  },
  create(context) {
    if (!isProtectedFilename(context.getFilename())) {
      return {};
    }

    function inspectExpression(node) {
      const expression = unwrapExpression(node);

      const { inspectable } = getObjectPropertyNames(expression);

      if (!inspectable) {
        context.report({ node: expression || node, messageId: "unknown" });

        return;
      }

      for (const property of expression.properties) {
        if (property.type === "SpreadElement") {
          continue;
        }

        const name = getStaticPropertyName(property);

        if (layoutPropertyNames.has(name)) {
          context.report({ node: property.key, messageId: "object" });
        }

        const value = unwrapExpression(property.value);

        if (
          name === "justifyContent" &&
          value?.type === "Literal" &&
          value.value === "space-between"
        ) {
          context.report({ node: property.key, messageId: "forbiddenValue" });
        }

        if (name === "transform") {
          context.report({ node: property.key, messageId: "forbiddenValue" });
        }
      }
    }

    return {
      JSXAttribute(node) {
        const name = getJsxAttributeName(node);

        if (name && layoutPropertyNames.has(name) && !isSemanticLayoutAttribute(node, name)) {
          context.report({ node: node.name, messageId: "attribute" });

          return;
        }

        if (name === "sx" || name === "style") {
          inspectExpression(getJsxExpression(node));
        }
      },
    };
  },
};

const noNegativeSpacingOutsideUi = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      value: "Negative spacing and offsets are only allowed inside UI primitives.",
    },
  },
  create(context) {
    if (!isProtectedFilename(context.getFilename())) {
      return {};
    }

    function hasNegativeValue(node) {
      const expression = unwrapExpression(node);

      if (expression?.type === "UnaryExpression" && expression.operator === "-") {
        return true;
      }

      return (
        expression?.type === "Literal" &&
        ((typeof expression.value === "number" && expression.value < 0) ||
          (typeof expression.value === "string" && /^-/.test(expression.value)))
      );
    }

    function inspectExpression(node) {
      const expression = unwrapExpression(node);

      if (!isObjectExpression(expression)) {
        return;
      }

      for (const property of expression.properties) {
        if (property.type === "SpreadElement") {
          continue;
        }

        const name = getStaticPropertyName(property);

        if (
          name &&
          (spacingPropertyNames.has(name) || layoutPropertyNames.has(name)) &&
          hasNegativeValue(property.value)
        ) {
          context.report({ node: property.value, messageId: "value" });
        }
      }
    }

    return {
      JSXAttribute(node) {
        const name = getJsxAttributeName(node);

        if (name && (spacingPropertyNames.has(name) || layoutPropertyNames.has(name))) {
          if (hasNegativeValue(getJsxExpression(node))) {
            context.report({ node: node.value || node.name, messageId: "value" });
          }
        }

        if (name === "sx" || name === "style") {
          inspectExpression(getJsxExpression(node));
        }
      },
    };
  },
};

export default {
  meta: { name: "portal-guesant-saberes-layout", version: "1.0.0" },
  rules: {
    "no-style-definition-outside-ui": noStyleDefinitionOutsideUi,
    "no-spacing-definition-outside-ui": noSpacingDefinitionOutsideUi,
    "no-layout-definition-outside-ui": noLayoutDefinitionOutsideUi,
    "no-negative-spacing-outside-ui": noNegativeSpacingOutsideUi,
  },
};
