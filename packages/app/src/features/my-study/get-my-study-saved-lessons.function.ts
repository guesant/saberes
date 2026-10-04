import type { CatalogCard, StudyRecord } from "@guesant/saberes-application";

export type GetMyStudySavedLessonsInput = {
  content: CatalogCard[];
  bookmarks: StudyRecord[] | undefined;
};

export function getMyStudySavedLessons(input: GetMyStudySavedLessonsInput): CatalogCard[] {
  const savedKeys = new Set(
    (input.bookmarks || [])
      .map((record) => {
        return record.contentKey;
      })
      .filter((contentKey): contentKey is string => {
        return Boolean(contentKey);
      }),
  );

  return input.content.filter((card) => {
    return card.type === "lesson" && savedKeys.has(`lesson:${String(card.slug)}`);
  });
}
