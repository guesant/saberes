import type { SavedCatalogFilter } from "@guesant/saberes-application";

export interface CatalogSavedFilterEditDialogProps {
  filter: SavedCatalogFilter;
  onSave(filter: SavedCatalogFilter, name: string): Promise<void>;
  title: string;
  triggerLabel: string;
}
