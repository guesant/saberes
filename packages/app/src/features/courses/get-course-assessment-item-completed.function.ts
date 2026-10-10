import type { Attempt, StudyRecord } from "@guesant/saberes-application";

export interface GetCourseAssessmentItemCompletedInput {
  attempts: Attempt[] | undefined;
  item: Record<string, unknown>;
  lessonProgress: StudyRecord[] | undefined;
  assessmentItemsById?: Record<string, Array<Record<string, unknown>> | undefined>;
}

export function getCourseAssessmentItemCompleted(
  input: GetCourseAssessmentItemCompletedInput,
): boolean {
  const assessmentItems = input.assessmentItemsById?.[String(input.item.assessment_set_id)] || [];

  const questionIds = assessmentItems
    .filter((assessmentItem) => {
      return assessmentItem.item_type === "question";
    })
    .map((assessmentItem) => {
      return assessmentItem.question_occurrence_id;
    })
    .filter((questionId) => {
      return questionId !== undefined && questionId !== null;
    })
    .map(String);

  if (questionIds.length > 0) {
    return questionIds.every((questionId) => {
      return input.attempts?.some((attempt) => {
        return String(attempt.questionId) === questionId;
      }) === true;
    });
  }

  const assessmentKey = `assessment:${String(input.item.assessment_set_id)}`;

  return Boolean(input.lessonProgress?.some((progress) => {
    return progress.contentKey === assessmentKey && progress.completed === true;
  }));
}
