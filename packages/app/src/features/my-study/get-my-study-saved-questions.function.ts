import type { CatalogCard, StudyRecord } from "@guesant/saberes-application";

export type GetMyStudySavedQuestionsInput = {
  bookmarks: StudyRecord[] | undefined;
  content: CatalogCard[];
};

export function getMyStudySavedQuestions(input: GetMyStudySavedQuestionsInput): CatalogCard[] {
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
    return card.type === "question" && savedKeys.has(`question:${String(card.id)}`);
  });
}
