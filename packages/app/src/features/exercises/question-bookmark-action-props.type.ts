export type QuestionBookmarkActionProps = {
  bookmarked: boolean;
  onBookmark(): Promise<void>;
};
