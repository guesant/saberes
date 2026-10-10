import { describe, expect, it } from "vitest";
import { getResponsiveGridTracks } from "./get-responsive-grid-tracks.function";

describe("tracks de UIGrid", () => {
  it("limita a duas colunas e reduz a uma coluna em telas estreitas", () => {
    expect(getResponsiveGridTracks(2, "comfortable"))
      .toEqual({
        xs: "minmax(0, 1fr)",
        sm: "repeat(1, minmax(0, 1fr))",
        md: "repeat(2, minmax(0, 1fr))",
      });
  });

  it("nunca permite mais de duas colunas, mesmo diante de configuração legada inválida", () => {
    expect(getResponsiveGridTracks(4, "compact"))
      .toEqual({
        xs: "minmax(0, 1fr)",
        sm: "repeat(2, minmax(0, 1fr))",
        md: "repeat(2, minmax(0, 1fr))",
      });
  });

  it("limita grids sem número explícito a duas colunas", () => {
    expect(getResponsiveGridTracks(undefined, "compact"))
      .toEqual({
        xs: "minmax(0, 1fr)",
        sm: "repeat(2, minmax(0, 1fr))",
        md: "repeat(2, minmax(0, 1fr))",
      });
  });
});
