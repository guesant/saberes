import type { SavedCatalogFilter } from "../models/index";

export interface ListSavedCatalogFiltersPort {
  execute(): Promise<SavedCatalogFilter[]>;
}
