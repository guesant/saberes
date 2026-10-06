const protectedSourcePattern = /\/packages\/(?:app\/src|pkg-ui-content\/src)\//;

const layoutSourcePattern = /\/packages\/(?:app\/src|pkg-ui\/src|pkg-ui-content\/src)\//;

const uiImplementationSourcePattern = /\/packages\/(?:pkg-ui|pkg-ui-content)\/src\//;

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

const structuralActionNames = new Set([
  "UIButton",
  "UIIconButton",
  "UIDownloadFileButton",
  "UIFileInput",
  "UIStepButton",
  "UIButtonBase",
]);

const formControlNames = new Set(["UIAutocomplete", "UIInput", "UISelect", "UITextField"]);

const fullWidthControlNames = new Set([
  ...formControlNames,
  "UIButton",
  "UIDownloadFileButton",
  "UIIconButton",
  "UIStepButton",
]);

const actionGroupNames = new Set([
  "UIBottomNavigation",
  "UIFormActions",
  "UIInlineActions",
  "UIToolbar",
]);

const structuralHtmlElements = new Set([
  "address",
  "article",
  "aside",
  "blockquote",
  "body",
  "caption",
  "col",
  "colgroup",
  "dd",
  "details",
  "div",
  "dl",
  "dt",
  "figure",
  "figcaption",
  "fieldset",
  "footer",
  "form",
  "header",
  "main",
  "menu",
  "nav",
  "li",
  "ol",
  "table",
  "section",
  "summary",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
  "ul",
]);

const forbiddenRawStructuralElements = new Set([
  ...structuralHtmlElements,
]);

const muiStackSourcePattern = /^@mui\/(?:material|system)(?:\/Stack)?$/;

const muiStackSubpathPattern = /^@mui\/(?:material|system)\/Stack$/;

function normalizeFilename(filename) {
  return filename.replaceAll("\\", "/");
}

function isProtectedFilename(filename) {
  return protectedSourcePattern.test(normalizeFilename(filename));
}

function isLayoutFilename(filename) {
  return layoutSourcePattern.test(normalizeFilename(filename));
}

function isUiImplementationFilename(filename) {
  return uiImplementationSourcePattern.test(normalizeFilename(filename));
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

function getOpeningElementName(node) {
  if (node.name.type === "JSXIdentifier") {
    return node.name.name;
  }

  return undefined;
}

function getJsxAttribute(node, name) {
  return node.attributes.find((attribute) => {
    return attribute.type === "JSXAttribute" && getJsxAttributeName(attribute) === name;
  });
}

function getStaticAttributeValue(node, name) {
  const attribute = getJsxAttribute(node, name);

  if (!attribute) {
    return undefined;
  }

  if (!attribute.value) {
    return true;
  }

  if (attribute.value.type === "Literal") {
    return attribute.value.value;
  }

  const expression = getJsxExpression(attribute);

  if (expression?.type === "Literal") {
    return expression.value;
  }

  return undefined;
}

function hasJsxAttribute(node, name) {
  return Boolean(getJsxAttribute(node, name));
}

function getExpressionProperties(node) {
  const expression = unwrapExpression(node);

  if (!isObjectExpression(expression)) {
    return { inspectable: false, properties: [] };
  }

  const properties = [];

  let inspectable = true;

  for (const property of expression.properties) {
    if (property.type === "SpreadElement") {
      inspectable = false;

      continue;
    }

    const name = getStaticPropertyName(property);

    if (!name) {
      inspectable = false;

      continue;
    }

    properties.push({ name, value: unwrapExpression(property.value), node: property });
  }

  return { inspectable, properties };
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
          if (getJsxOpeningElementName(node) === "UIBox" && name === "gap") {
            return;
          }

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


const noUiDataAttributes = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      attribute: "Do not encode UI contracts in data-ui-* attributes; use typed UI props and semantic HTML/ARIA.",
    },
  },
  create(context) {
    if (!isLayoutFilename(context.getFilename())) {
      return {};
    }

    return {
      JSXAttribute(node) {
        const name = getJsxAttributeName(node);

        if (name?.startsWith("data-ui-")) {
          context.report({ node: node.name, messageId: "attribute" });
        }
      },
    };
  },
};

const uiBoxOnlyLayoutDefinition = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      attribute: "Structural layout must be configured through UIBox, not directly on {{component}}.",
      style: "Structural layout styles must be passed through UIBox, not {{component}} sx/style.",
      primitive: "Use UIBox instead of the raw MUI layout primitive {{component}}.",
    },
  },
  create(context) {
    if (!isUiImplementationFilename(context.getFilename()) || /\/box\.component\.tsx$/u.test(context.getFilename())) {
      return {};
    }

    const structuralProperties = new Set([
      "alignContent", "alignItems", "columnGap", "display", "flexDirection", "flexWrap", "gap",
      "gridAutoColumns", "gridAutoFlow", "gridAutoRows", "gridColumn", "gridRow", "gridTemplate",
      "gridTemplateAreas", "gridTemplateColumns", "gridTemplateRows", "justifyContent", "justifyItems",
      "rowGap",
    ]);

    return {
      JSXOpeningElement(node) {
        const component = getOpeningElementName(node);

        if (!component || component === "UIBox") {
          return;
        }

        if (["Box", "Grid", "MuiBox", "MuiGrid", "MuiStack", "Stack"].includes(component)) {
          context.report({ node: node.name, data: { component }, messageId: "primitive" });
        }

        node.attributes.forEach((attribute) => {
          if (attribute.type !== "JSXAttribute") {
            return;
          }

          const name = getJsxAttributeName(attribute);

          if (name === "container" || name === "spacing") {
            context.report({ node: attribute.name, data: { component }, messageId: "attribute" });
          }

          if (name && structuralProperties.has(name)) {
            context.report({ node: attribute.name, data: { component }, messageId: "attribute" });
          }

          if (name !== "sx" && name !== "style") {
            return;
          }

          const expression = getJsxExpression(attribute);

          const properties = getExpressionProperties(expression);

          properties.properties.forEach((property) => {
            if (structuralProperties.has(property.name)) {
              context.report({ node: property.node ?? expression, data: { component }, messageId: "style" });
            }
          });
        });
      },
    };
  },
};

const actionGroupContract = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      group: "Multiple structural actions must be wrapped by a semantic action group component.",
    },
  },
  create(context) {
    if (!isLayoutFilename(context.getFilename())) {
      return {};
    }

    return {
      JSXElement(node) {
        const parentName = getOpeningElementName(node.openingElement);

        if (parentName && actionGroupNames.has(parentName)) {
          return;
        }

        const actions = node.children.filter((child) => {
          if (child.type !== "JSXElement") {
            return false;
          }

          return structuralActionNames.has(getOpeningElementName(child.openingElement));
        });

        if (actions.length > 1) {
          context.report({ node: node.openingElement, messageId: "group" });
        }
      },
    };
  },
};

const bottomNavigationContract = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      icon: "Bottom navigation actions must provide an icon.",
      label: "Bottom navigation actions must provide a label.",
      value: "Bottom navigation actions must provide a value.",
    },
  },
  create(context) {
    if (!isLayoutFilename(context.getFilename())) {
      return {};
    }

    return {
      JSXOpeningElement(node) {
        const name = getOpeningElementName(node);

        if (name !== "UIBottomNavigationAction") {
          return;
        }

        for (const [attributeName, messageId] of [
          ["icon", "icon"],
          ["label", "label"],
          ["value", "value"],
        ]) {
          if (!hasJsxAttribute(node, attributeName)) {
            context.report({ node, messageId });
          }
        }
      },
    };
  },
};

const contentGroupContract = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      tight:
        "Tight content groups may contain at most two direct children. Use a readable content or section group for multi-line information.",
    },
  },
  create(context) {
    if (!isLayoutFilename(context.getFilename())) {
      return {};
    }

    return {
      JSXOpeningElement(node) {
        if (
          getOpeningElementName(node) !== "UIContentGroup" ||
          getStaticAttributeValue(node, "variant") !== "tight" ||
          node.parent?.type !== "JSXElement"
        ) {
          return;
        }

        const directChildren = node.parent.children.filter((child) => {
          if (child.type === "JSXElement" || child.type === "JSXFragment") {
            return true;
          }

          return (
            child.type === "JSXExpressionContainer" &&
            child.expression.type !== "JSXEmptyExpression"
          );
        });

        if (directChildren.length > 2) {
          context.report({ node, messageId: "tight" });
        }
      },
    };
  },
};

const surfaceInsetContract = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      surface:
        "Presentation surfaces must expose an explicit inset. Use UIContentSurface instead of raw UIPaper so mobile padding is guaranteed.",
    },
  },
  create(context) {
    if (!isProtectedFilename(context.getFilename())) {
      return {};
    }

    return {
      JSXOpeningElement(node) {
        if (getOpeningElementName(node) === "UIPaper") {
          context.report({ node, messageId: "surface" });
        }
      },
    };
  },
};

const noFullWidthControlOutsideUi = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      control:
        "Full-width controls are not allowed in application presentation. Let the UI layout parent own control sizing.",
    },
  },
  create(context) {
    if (!isProtectedFilename(context.getFilename())) {
      return {};
    }

    return {
      JSXOpeningElement(node) {
        const name = getOpeningElementName(node);

        if (name && fullWidthControlNames.has(name) && hasJsxAttribute(node, "fullWidth")) {
          context.report({ node: getJsxAttribute(node, "fullWidth"), messageId: "control" });
        }
      },
    };
  },
};

const formControlLabelContract = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      label:
        "Form controls must provide a persistent label, aria-label or aria-labelledby. A placeholder is not a label.",
    },
  },
  create(context) {
    if (!isProtectedFilename(context.getFilename())) {
      return {};
    }

    return {
      JSXOpeningElement(node) {
        const name = getOpeningElementName(node);

        if (
          !name ||
          !formControlNames.has(name) ||
          hasJsxAttribute(node, "label") ||
          hasJsxAttribute(node, "aria-label") ||
          hasJsxAttribute(node, "aria-labelledby")
        ) {
          return;
        }

        context.report({ node, messageId: "label" });
      },
    };
  },
};

const noTechnicalFormCopy = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      copy: "Technical ContentKey identifiers must not be exposed as user-facing form copy.",
    },
  },
  create(context) {
    if (!isProtectedFilename(context.getFilename())) {
      return {};
    }

    function isTechnicalCopy(value) {
      return typeof value === "string" && /contentkey/i.test(value);
    }

    function inspectAttribute(node) {
      const name = getJsxAttributeName(node);

      if (!name || !["helperText", "label", "placeholder"].includes(name)) {
        return;
      }

      const expression = node.value?.type === "Literal" ? node.value : getJsxExpression(node);

      if (expression?.type === "Literal" && isTechnicalCopy(expression.value)) {
        context.report({ node: node.value || node.name, messageId: "copy" });
      }
    }

    return {
      JSXAttribute: inspectAttribute,
      JSXText(node) {
        if (isTechnicalCopy(node.value)) {
          context.report({ node, messageId: "copy" });
        }
      },
    };
  },
};

const noMuiStack = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      import: "MUI Stack is prohibited. Use flex or grid with gap through a UI layout primitive.",
      member: "MUI Stack is prohibited. Use flex or grid with gap through a UI layout primitive.",
      require: "MUI Stack is prohibited. Use flex or grid with gap through a UI layout primitive.",
      dynamicImport:
        "MUI Stack is prohibited. Use flex or grid with gap through a UI layout primitive.",
      reexport: "MUI Stack is prohibited. Do not reexport MUI Stack or StackProps.",
    },
  },
  create(context) {
    const namespaceNames = new Set();

    function isMuiSource(source) {
      return typeof source === "string" && muiStackSourcePattern.test(source);
    }

    function isStackSubpath(source) {
      return typeof source === "string" && muiStackSubpathPattern.test(source);
    }

    function reportImportSpecifier(specifier) {
      context.report({ node: specifier, messageId: "import" });
    }

    function inspectImportDeclaration(node) {
      const source = node.source.value;

      if (!isMuiSource(source)) {
        return;
      }

      if (isStackSubpath(source)) {
        context.report({ node: node.source, messageId: "import" });

        return;
      }

      for (const specifier of node.specifiers) {
        if (specifier.type === "ImportSpecifier") {
          const importedName = specifier.imported.name ?? specifier.imported.value;

          if (importedName === "Stack" || importedName === "StackProps") {
            reportImportSpecifier(specifier);
          }
        }

        if (specifier.type === "ImportNamespaceSpecifier") {
          namespaceNames.add(specifier.local.name);
        }
      }
    }

    function inspectReexport(node) {
      const source = node.source?.value;

      if (!isMuiSource(source)) {
        return;
      }

      if (node.type === "ExportAllDeclaration") {
        context.report({ node: node.source, messageId: "reexport" });

        return;
      }

      for (const specifier of node.specifiers) {
        const importedName = specifier.local.name ?? specifier.local.value;

        if (importedName === "Stack" || importedName === "StackProps") {
          context.report({ node: specifier, messageId: "reexport" });
        }
      }
    }

    function inspectRequire(node) {
      if (
        node.callee.type !== "Identifier" ||
        node.callee.name !== "require" ||
        node.arguments.length !== 1 ||
        node.arguments[0].type !== "Literal"
      ) {
        return;
      }

      const source = node.arguments[0].value;

      if (isStackSubpath(source)) {
        context.report({ node: node.arguments[0], messageId: "require" });
      }

      if (!isMuiSource(source) || isStackSubpath(source)) {
        return;
      }

      const { parent } = node;

      if (
        parent?.type === "VariableDeclarator" &&
        parent.id.type === "ObjectPattern" &&
        parent.id.properties.some((property) => {
          return (
            property.type === "Property" &&
            property.key.type === "Identifier" &&
            (property.key.name === "Stack" || property.key.name === "StackProps")
          );
        })
      ) {
        context.report({ node, messageId: "require" });
      }
    }

    function inspectMemberExpression(node) {
      let memberName;

      if (
        node.computed &&
        node.property.type === "Literal" &&
        typeof node.property.value === "string"
      ) {
        memberName = node.property.value;
      }

      if (!node.computed && node.property.type === "Identifier") {
        memberName = node.property.name;
      }

      const isForbiddenMember = memberName === "Stack" || memberName === "StackProps";

      if (
        node.object.type === "CallExpression" &&
        node.object.callee.type === "Identifier" &&
        node.object.callee.name === "require" &&
        node.object.arguments.length === 1 &&
        node.object.arguments[0].type === "Literal" &&
        isMuiSource(node.object.arguments[0].value) &&
        isForbiddenMember
      ) {
        context.report({ node: node.property, messageId: "member" });

        return;
      }

      if (
        node.object.type !== "Identifier" ||
        !namespaceNames.has(node.object.name) ||
        !isForbiddenMember
      ) {
        return;
      }

      context.report({ node: node.property, messageId: "member" });
    }

    function inspectNamespaceDestructuring(node) {
      if (
        node.id.type !== "ObjectPattern" ||
        node.init?.type !== "Identifier" ||
        !namespaceNames.has(node.init.name)
      ) {
        return;
      }

      const hasForbiddenProperty = node.id.properties.some((property) => {
        if (property.type !== "Property") {
          return false;
        }

        let propertyName;

        if (property.key.type === "Identifier") {
          propertyName = property.key.name;
        }

        if (property.key.type === "Literal" && typeof property.key.value === "string") {
          propertyName = property.key.value;
        }

        return propertyName === "Stack" || propertyName === "StackProps";
      });

      if (hasForbiddenProperty) {
        context.report({ node, messageId: "member" });
      }
    }

    function inspectDynamicImport(node) {
      if (node.source.type !== "Literal" || !isStackSubpath(node.source.value)) {
        return;
      }

      context.report({ node: node.source, messageId: "dynamicImport" });
    }

    return {
      ImportDeclaration: inspectImportDeclaration,
      ExportAllDeclaration: inspectReexport,
      ExportNamedDeclaration: inspectReexport,
      CallExpression(node) {
        inspectRequire(node);
      },
      ImportExpression: inspectDynamicImport,
      MemberExpression: inspectMemberExpression,
      VariableDeclarator: inspectNamespaceDestructuring,
    };
  },
};

const uiBoxOnlyStructuralRendering = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      element: "Render structural HTML through UIBox, never as a raw JSX element.",
      component: "Only UIBox may receive a native structural component prop.",
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (
          node.name.type === "JSXIdentifier" &&
          forbiddenRawStructuralElements.has(node.name.name)
        ) {
          context.report({ node: node.name, messageId: "element" });
        }

        const elementName = node.name.type === "JSXIdentifier" ? node.name.name : undefined;

        if (!elementName || elementName === "UIBox") {
          return;
        }

        const componentAttribute = getJsxAttribute(node, "component");

        if (!componentAttribute) {
          return;
        }

        const { value } = componentAttribute;

        if (value?.type === "Literal" && structuralHtmlElements.has(value.value)) {
          context.report({ node: componentAttribute.name, messageId: "component" });

          return;
        }

        const expression = getJsxExpression(componentAttribute);

        if (expression?.type === "ConditionalExpression") {
          const values = [expression.consequent, expression.alternate]
            .filter((branch) => { return branch.type === "Literal"; })
            .map((branch) => { return branch.value; });

          if (values.some((component) => { return structuralHtmlElements.has(component); })) {
            context.report({ node: componentAttribute.name, messageId: "component" });
          }
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
    "no-ui-data-attributes": noUiDataAttributes,
    "ui-box-only-layout-definition": uiBoxOnlyLayoutDefinition,
    "action-group-contract": actionGroupContract,
    "bottom-navigation-contract": bottomNavigationContract,
    "content-group-contract": contentGroupContract,
    "surface-inset-contract": surfaceInsetContract,
    "no-full-width-control-outside-ui": noFullWidthControlOutsideUi,
    "form-control-label-contract": formControlLabelContract,
    "no-technical-form-copy": noTechnicalFormCopy,
    "no-mui-stack": noMuiStack,
    "ui-box-only-structural-rendering": uiBoxOnlyStructuralRendering,
  },
};
