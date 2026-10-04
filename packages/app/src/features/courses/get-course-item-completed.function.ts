import { getCourseLessonItemCompleted } from "./get-course-lesson-item-completed.function";
import { getCourseQuestionItemCompleted } from "./get-course-question-item-completed.function";
import type { Attempt, StudyRecord } from "@guesant/saberes-application";

export interface GetCourseItemCompletedInput {
  attempts: Attempt[] | undefined;
  item: Record<string, unknown>;
  lessonProgress: StudyRecord[] | undefined;
}

export function getCourseItemCompleted(input: GetCourseItemCompletedInput): boolean {
  if (input.item.lesson_id) {
    return getCourseLessonItemCompleted({
      item: input.item,
      lessonProgress: input.lessonProgress,
    });
  }

  if (input.item.question_occurrence_id) {
    return getCourseQuestionItemCompleted({ attempts: input.attempts, item: input.item });
  }

  return false;
}
