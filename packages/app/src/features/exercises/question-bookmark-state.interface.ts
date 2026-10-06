export interface QuestionBookmarkState {
  bookmarked: boolean;
  pending: boolean;
  error: Error | null;
  reload(): Promise<void>;

  toggle(): Promise<void>;
}
