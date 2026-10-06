import { describe, expect, it } from "vitest";
import { getUiSpacing } from "./get-ui-spacing.function";

describe("tokens de espaçamento de UI", () => {
  it("usa a escala nominal baseada em 8px", () => {
    expect(getUiSpacing("none"))
      .toBe(0);

    expect(getUiSpacing("xs"))
      .toBe(0.5);

    expect(getUiSpacing("sm"))
      .toBe(1);

    expect(getUiSpacing("md"))
      .toBe(2);

    expect(getUiSpacing("lg"))
      .toBe(3);

    expect(getUiSpacing("xl"))
      .toBe(4);
  });

  it("usa 3rem de espaçamento entre seções em todos os tamanhos", () => {
    expect(getUiSpacing("section"))
      .toEqual({ xs: 6, md: 6 });
  });
});
