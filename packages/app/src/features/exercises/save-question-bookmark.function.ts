import type {
  ApplicationServices,
  QuestionReadModel,
  StudyRecord,
} from "@guesant/saberes-application";

export type SaveQuestionBookmarkInput = {
  contentKey: string;
  data: QuestionReadModel | null;
  services: ApplicationServices;
};

export function saveQuestionBookmark(input: SaveQuestionBookmarkInput): Promise<StudyRecord> {
  return input.services.progress.saveBookmark.execute({
    contentKey: input.contentKey,
    data: {
      number: input.data?.question.number,
      questionId: input.data?.question.occurrence_id,
      title: input.data?.question.statement,
      type: "question",
    },
  });
}
