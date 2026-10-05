export interface CatalogSavedFilterDeleteAction {
  delete(id: string): Promise<void>;
  error: Error | null;
  pending: boolean;
}
