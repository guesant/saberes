export type QuestionBookmarkErrorProps = {
  error: Error;
  onRetry: () => Promise<void>;
};
