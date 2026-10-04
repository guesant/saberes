export interface QuestionBookmarkState {
  bookmarked: boolean;
  error: Error | null;
  reload: () => Promise<void>;
  save: () => Promise<void>;
}
