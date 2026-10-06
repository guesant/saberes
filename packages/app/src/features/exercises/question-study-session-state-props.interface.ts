export interface QuestionStudySessionStateProps {
  loading: boolean;
  error: Error | null;
  label: string;
  notFoundLabel: string;
  onRetry(): Promise<void>;
}
