import { getCourseItemCompleted } from "./get-course-item-completed.function";
import { getCourseTrackableItems } from "./get-course-trackable-items.function";
import type { CourseProgress } from "./course-progress.interface";
import type { Attempt, StudyRecord } from "@guesant/saberes-application";

export interface GetCourseProgressInput {
  attempts: Attempt[] | undefined;
  items: Array<Record<string, unknown>>;
  lessonProgress: StudyRecord[] | undefined;
}

export function getCourseProgress(input: GetCourseProgressInput): CourseProgress {
  const trackableItems = getCourseTrackableItems(input.items);

  const completedItems = trackableItems.filter((item) => {
    return getCourseItemCompleted({
      attempts: input.attempts,
      item,
      lessonProgress: input.lessonProgress,
    });
  }).length;

  const totalItems = trackableItems.length;

  return {
    completedItems,
    percentage: totalItems ? Math.round((completedItems / totalItems) * 100) : 0,
    totalItems,
  };
}
