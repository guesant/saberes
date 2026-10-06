export interface CatalogSavedFilterEditFormProps {
  formId: string;
  initialName: string;
  onSave(name: string): Promise<void>;
}
