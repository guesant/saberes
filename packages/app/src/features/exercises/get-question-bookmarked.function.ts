import type { StudyRecord } from "@guesant/saberes-application";

export function getQuestionBookmarked(
  bookmarks: StudyRecord[] | undefined,
  contentKey: string,
): boolean {
  return Boolean(
    bookmarks?.some((bookmark) => {
      return bookmark.contentKey === contentKey;
    }),
  );
}
