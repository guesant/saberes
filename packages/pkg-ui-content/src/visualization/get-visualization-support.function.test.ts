import { describe, expect, it } from "vitest";
import { getVisualizationSupport } from "./get-visualization-support.function";

describe("getVisualizationSupport", () => {
  it("descreve as capacidades gráficas disponíveis no ambiente", () => {
    const support = getVisualizationSupport();

    expect(typeof support.canvas2d)
      .toBe("boolean");

    expect(typeof support.webgl)
      .toBe("boolean");
  });
});
