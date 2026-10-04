import type { SavedCatalogFilter } from "@guesant/saberes-application";

export type CatalogSavedFilterItemProps = {
  filter: SavedCatalogFilter;
  onDelete(id: string): Promise<void>;

  onSelect(filter: SavedCatalogFilter): void;
};
