import type { Attempt, StudyRecord } from "@guesant/saberes-application";

export interface GetNextCourseItemHrefInput {
  attempts: Attempt[] | undefined;
  items: Array<Record<string, unknown>>;
  lessonProgress: StudyRecord[] | undefined;
}
