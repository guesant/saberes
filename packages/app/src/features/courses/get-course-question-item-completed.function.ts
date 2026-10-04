import type { Attempt } from "@guesant/saberes-application";

export interface GetCourseQuestionItemCompletedInput {
  attempts: Attempt[] | undefined;
  item: Record<string, unknown>;
}

export function getCourseQuestionItemCompleted(
  input: GetCourseQuestionItemCompletedInput,
): boolean {
  const questionId = String(input.item.question_occurrence_id);

  return Boolean(
    input.attempts?.some((attempt) => {
      return String(attempt.questionId) === questionId;
    }),
  );
}
