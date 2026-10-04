import type { CreateSavedCatalogFilterInput } from "./create-saved-catalog-filter-input.type";
import type { SavedCatalogFilter } from "@guesant/saberes-application";

export function createSavedCatalogFilter(input: CreateSavedCatalogFilterInput): SavedCatalogFilter {
  return {
    id: input.id,
    name: input.name,
    filters: input.filters,
    updatedAt: input.updatedAt,
  };
}
