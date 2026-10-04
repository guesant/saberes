import type { CatalogFilters } from "@guesant/saberes-application";

export function getCatalogFilters(filters: CatalogFilters): CatalogFilters {
  return {
    ...filters,
    processName: filters.processName?.trim()
      .toLocaleLowerCase(),
    search: filters.search?.trim()
      .toLocaleLowerCase(),
  };
}
