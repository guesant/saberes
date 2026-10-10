import { getCourseReferenceId } from "./get-course-reference-id.function";
import type { Attempt } from "@guesant/saberes-application";

export interface GetCourseQuestionItemCompletedInput {
  attempts: Attempt[] | undefined;
  item: Record<string, unknown>;
}

export function getCourseQuestionItemCompleted(
  input: GetCourseQuestionItemCompletedInput,
): boolean {
  const occurrenceId = getCourseReferenceId(input.item.question_occurrence_id);

  const canonicalQuestionId = getCourseReferenceId(input.item.question_id);

  return Boolean(
    input.attempts?.some((attempt) => {
      return (
        (occurrenceId !== null && String(attempt.questionId) === occurrenceId) ||
        (canonicalQuestionId !== null &&
          attempt.canonicalQuestionId !== undefined &&
          String(attempt.canonicalQuestionId) === canonicalQuestionId)
      );
    }),
  );
}
