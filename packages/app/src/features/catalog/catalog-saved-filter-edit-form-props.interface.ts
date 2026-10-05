export interface CatalogSavedFilterEditFormProps {
  initialName: string;
  onSave(name: string): Promise<void>;
}
