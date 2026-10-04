import type { SavedCatalogFilter } from "@guesant/saberes-application";

export type CatalogSavedFiltersProps = {
  error: Error | null;
  filters: SavedCatalogFilter[];
  onDelete(id: string): Promise<void>;

  onRetry(): Promise<void>;

  onSave(name: string): Promise<void>;

  onSelect(filter: SavedCatalogFilter): void;
  saveError: Error | null;
  saving: boolean;
  state: "loading" | "error" | "ready";
};
