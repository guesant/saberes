import type { SavedCatalogFilter } from "../models/index";

export interface SaveSavedCatalogFilterPort {
  execute(input: SavedCatalogFilter): Promise<void>;
}
