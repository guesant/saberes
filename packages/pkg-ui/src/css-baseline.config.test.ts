import { describe, expect, it } from "vitest";
import { cssBaselineConfig } from "./css-baseline.config";

describe("reset visual explícito", () => {
  it("define geometria e tipografia base", () => {
    const universal = cssBaselineConfig["*, *::before, *::after"];

    expect(universal.margin)
      .toBe(0);

    expect(universal.padding)
      .toBe(0);

    expect(universal.gap)
      .toBe(0);

    expect(universal.outline)
      .toBe(0);

    expect(universal.fontWeight)
      .toBe("inherit");

    expect(universal.lineHeight)
      .toBe("inherit");
  });

  it("restabelece hierarquia de headings e foco visível", () => {
    expect(cssBaselineConfig["h1, h2, h3, h4, h5, h6"].fontWeight)
      .toBe(700);

    expect(cssBaselineConfig["*:focus-visible"].outline)
      .toContain("solid");

    expect(cssBaselineConfig["*:focus-visible"].outlineOffset)
      .toBe("2px");
  });
});
