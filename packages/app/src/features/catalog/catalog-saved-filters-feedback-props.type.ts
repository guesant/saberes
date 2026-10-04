export type CatalogSavedFiltersFeedbackProps = {
  error: Error | null;
  onRetry(): Promise<void>;
  state: "loading" | "error" | "ready";
};
