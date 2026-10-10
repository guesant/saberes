import { getCourseProgress } from "./get-course-progress.function";
import { getCourseStarted } from "./get-course-started.function";
import type { CourseViewProgress } from "./course-view-progress.interface";
import type { CourseProgressQueries } from "./use-course-progress-queries.hook";

export function getCourseViewProgress(
  slug: string | undefined,
  progressQueries: CourseProgressQueries,
  items: Array<Record<string, unknown>>,
): CourseViewProgress {
  return {
    started: getCourseStarted({ records: progressQueries.enrollments, slug }),
    progress: getCourseProgress({
      attempts: progressQueries.attempts,
      items,
      lessonProgress: progressQueries.lessonProgress,
      assessmentItemsById: progressQueries.assessmentItemsById,
    }),
  };
}
