export type CatalogSavedFilterFormProps = {
  onSave: (name: string) => Promise<void>;
  saving: boolean;
};
