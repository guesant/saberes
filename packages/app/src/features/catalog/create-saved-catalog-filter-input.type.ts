import type { CatalogFilters } from "@guesant/saberes-application";

export type CreateSavedCatalogFilterInput = {
  filters: CatalogFilters;
  id: string;
  name: string;
  updatedAt: string;
};
