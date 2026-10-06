import { describe, expect, it } from "vitest";
import { theme } from "./theme.config";

describe("tema da plataforma", () => {
  it("usa a identidade visual da aplicação", () => {
    expect(theme.palette.primary.main)
      .toBe("#566170");

    expect(theme.palette.secondary.main)
      .toBe("#68717d");
  });

  it("declara esquema escuro para respeitar a preferência do sistema", () => {
    expect(Object.hasOwn(theme, "colorSchemes"))
      .toBe(true);
  });

  it("mantém a tipografia editorial e headings em negrito", () => {
    expect(theme.typography.fontFamily)
      .toContain("Roboto Slab");

    expect(theme.typography.body1.lineHeight)
      .toBe(1.5);

    expect(theme.typography.h1.fontWeight)
      .toBe(700);

    expect(theme.typography.h4.fontWeight)
      .toBe(700);
  });

  it("mantém controles de ação em uma linha e com altura fixa", () => {
    const buttonRoot = theme.components?.MuiButton?.styleOverrides?.root;

    expect(buttonRoot)
      .toMatchObject({ height: 44, minHeight: 44, whiteSpace: "nowrap" });
  });


  it("diferencia cards do fundo e mantém suas bordas", () => {
    const cardRoot = theme.components?.MuiCard?.styleOverrides?.root;

    expect(cardRoot)
      .toMatchObject({
        backgroundColor: "var(--mui-palette-action-hover)",
        border: "1px solid var(--mui-palette-divider)",
    });
  });

  it("delimita listas no início, entre itens e no fim", () => {
    const listRoot = theme.components?.MuiList?.styleOverrides?.root;

    expect(listRoot).toMatchObject({
      borderBlock: "1px solid var(--mui-palette-divider)",
      "& > * + *": { borderBlockStart: "1px solid var(--mui-palette-divider)" },
      paddingBlock: 0,
    });
  });

  it("delimita tabs antes, entre e depois sem desativar rolagem", () => {
    const tabsRoot = theme.components?.MuiTabs?.styleOverrides?.root;
    const tabRoot = theme.components?.MuiTab?.styleOverrides?.root;

    expect(tabsRoot).toMatchObject({ borderBlock: "1px solid var(--mui-palette-divider)" });
    expect(tabRoot).toMatchObject({
      borderInlineEnd: "1px solid var(--mui-palette-divider)",
      "&:first-of-type": { borderInlineStart: "1px solid var(--mui-palette-divider)" },
      whiteSpace: "nowrap",
    });
  });
});
