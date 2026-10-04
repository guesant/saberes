export interface LessonSectionContentErrorState {
  status: "error";
  error: unknown;
  onRetry(): Promise<void>;
}
