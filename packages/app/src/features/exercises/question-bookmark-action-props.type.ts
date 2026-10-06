export type QuestionBookmarkActionProps = {
  bookmarked: boolean;
  pending: boolean;
  onBookmark(): Promise<void>;
};
