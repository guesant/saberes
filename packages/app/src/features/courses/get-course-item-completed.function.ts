import { getCourseAssessmentItemCompleted } from "./get-course-assessment-item-completed.function";
import { getCourseLessonItemCompleted } from "./get-course-lesson-item-completed.function";
import { getCourseQuestionItemCompleted } from "./get-course-question-item-completed.function";
import type { Attempt, StudyRecord } from "@guesant/saberes-application";

export interface GetCourseItemCompletedInput {
  attempts: Attempt[] | undefined;
  item: Record<string, unknown>;
  lessonProgress: StudyRecord[] | undefined;
  assessmentItemsById?: Record<string, Array<Record<string, unknown>> | undefined>;
}

export function getCourseItemCompleted(input: GetCourseItemCompletedInput): boolean {
  if (input.item.lesson_id) {
    return getCourseLessonItemCompleted({ item: input.item, lessonProgress: input.lessonProgress });
  }

  if (input.item.question_occurrence_id || input.item.question_id) {
    return getCourseQuestionItemCompleted({ attempts: input.attempts, item: input.item });
  }

  if (input.item.assessment_set_id) {
    return getCourseAssessmentItemCompleted(input);
  }

  return false;
}
