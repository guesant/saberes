export type AssessmentProgressErrorProps = {
  error: Error;
  onRetry: () => Promise<void>;
};
