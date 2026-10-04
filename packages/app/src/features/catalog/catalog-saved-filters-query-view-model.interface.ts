import type { QueryViewState } from "../../view-models/get-query-view-state.function";
import type { SavedCatalogFilter } from "@guesant/saberes-application";

export interface CatalogSavedFiltersQueryViewModel {
  data: SavedCatalogFilter[];
  error: Error | null;
  reload(): Promise<void>;
  state: QueryViewState;
}
