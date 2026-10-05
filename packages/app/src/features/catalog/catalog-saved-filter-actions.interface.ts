import type { SavedCatalogFilter } from "@guesant/saberes-application";

export interface CatalogSavedFilterActions {
  deleteFilter(id: string): Promise<void>;

  saveError: Error | null;
  saveFilter(name: string): Promise<void>;

  updateFilter(filter: SavedCatalogFilter, name: string): Promise<void>;
  saving: boolean;
}
