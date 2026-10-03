const noEmptyLineBetweenImports = {
  meta: {
    type: "layout",
    schema: [],
    messages: {
      emptyLine: "Imports must be contiguous without blank lines between them.",
    },
  },
  create(context) {
    let previousImport;

    return {
      ImportDeclaration(node) {
        if (previousImport) {
          const source = context.sourceCode.text.slice(previousImport.range[1], node.range[0]);

          if (/\r?\n\s*\r?\n/.test(source)) {
            context.report({ messageId: "emptyLine", node });
          }
        }

        previousImport = node;
      },
    };
  },
};

export default {
  rules: {
    "no-empty-line-between-imports": noEmptyLineBetweenImports,
  },
};
