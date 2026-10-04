import { describe, expect, it } from "vitest";
import { getCatalogFilters } from "./get-catalog-filters.function";

describe("filtros do catálogo", () => {
  it("normaliza texto e preserva filtros numéricos", () => {
    expect(
      getCatalogFilters({
        processName: "  Processo  ",
        search: "  função ",
        year: 2027,
      }),
    ).toEqual({ processName: "processo", search: "função", year: 2027 });
  });
});
