import { describe, expect, it } from "vitest";
import { getResponsiveGridTracks } from "./get-responsive-grid-tracks.function";

describe("tracks de UIGrid", () => {
  it("fecha colunas equivalentes e reduz a uma coluna em telas estreitas", () => {
    expect(getResponsiveGridTracks(3, "comfortable"))
      .toEqual({
        xs: "minmax(0, 1fr)",
        sm: "repeat(2, minmax(0, 1fr))",
        md: "repeat(3, minmax(0, 1fr))",
      });
  });

  it("adapta o número de tracks ao espaço disponível", () => {
    expect(getResponsiveGridTracks(undefined, "compact"))
      .toBe(
        "repeat(auto-fit, minmax(min(100%, 12rem), 1fr))",
      );
  });
});
