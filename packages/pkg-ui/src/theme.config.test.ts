import { describe, expect, it } from "vitest";
import { theme } from "./theme.config";

describe("tema da plataforma", () => {
  it("usa a identidade visual da aplicação", () => {
    expect(theme.palette.primary.main)
      .toBe("#152a4a");

    expect(theme.palette.secondary.main)
      .toBe("#e59b2f");
  });
});
