import type { Attempt, StudyRecord } from "@guesant/saberes-application";

export interface GetNextCourseItemHrefInput {
  attempts: Attempt[] | undefined;
  items: Array<Record<string, unknown>>;
  lessonProgress: StudyRecord[] | undefined;
  courseSlug?: string;
  assessmentItemsById?: Record<string, Array<Record<string, unknown>> | undefined>;
}
