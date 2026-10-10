import { getCourseItemCompleted } from "./get-course-item-completed.function";
import { getCourseItemHref } from "./get-course-item-href.function";
import { getCourseTrackableItems } from "./get-course-trackable-items.function";
import type { GetNextCourseItemHrefInput } from "./get-next-course-item-href-input.interface";

export function getNextCourseItemHref(input: GetNextCourseItemHrefInput): string | null {
  const items = getCourseTrackableItems(input.items);

  for (const item of items) {
    const isCompleted = getCourseItemCompleted({
      attempts: input.attempts,
      item,
      lessonProgress: input.lessonProgress,
      assessmentItemsById: input.assessmentItemsById,
    });

    const href = getCourseItemHref(item, input.courseSlug);

    if (!isCompleted && href) {
      return href;
    }
  }

  return null;
}
