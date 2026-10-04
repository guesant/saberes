import type { CatalogCard, StudyRecord } from "@guesant/saberes-application";

export type GetMyStudySavedQuestionsInput = {
  bookmarks: StudyRecord[] | undefined;
  content: CatalogCard[];
};

export function getMyStudySavedQuestions(input: GetMyStudySavedQuestionsInput): CatalogCard[] {
  const savedKeys = new Set(
    (input.bookmarks || [])
      .map((record) => record.contentKey)
      .filter((contentKey): contentKey is string => Boolean(contentKey)),
  );

  return input.content.filter(
    (card) => card.type === "question" && savedKeys.has(`question:${String(card.id)}`),
  );
}
