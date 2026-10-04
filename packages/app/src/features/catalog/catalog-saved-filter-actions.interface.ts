export interface CatalogSavedFilterActions {
  deleteFilter: (id: string) => Promise<void>;
  saveError: Error | null;
  saveFilter: (name: string) => Promise<void>;
  saving: boolean;
}
