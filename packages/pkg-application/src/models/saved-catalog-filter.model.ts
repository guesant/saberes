import type { CatalogFilters } from "@guesant/saberes-domain";

export interface SavedCatalogFilter {
  id: string;
  name: string;
  filters: CatalogFilters;
  updatedAt: string;
}
