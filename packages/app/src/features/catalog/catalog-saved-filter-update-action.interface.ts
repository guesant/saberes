import type { SavedCatalogFilter } from "@guesant/saberes-application";

export interface CatalogSavedFilterUpdateAction {
  error: Error | null;
  pending: boolean;
  update(filter: SavedCatalogFilter, name: string): Promise<void>;
}
