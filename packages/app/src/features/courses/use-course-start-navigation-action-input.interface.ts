import type { Attempt, CourseReadModel, StudyRecord } from "@guesant/saberes-application";

export interface UseCourseStartNavigationActionInput {
  action(): Promise<void>;
  attempts: Attempt[] | undefined;
  course: CourseReadModel | null | undefined;
  lessonProgress: StudyRecord[] | undefined;
}
