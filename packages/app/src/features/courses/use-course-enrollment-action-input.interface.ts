import type {
  ApplicationServices,
  Attempt,
  CourseReadModel,
  StudyRecord,
} from "@guesant/saberes-application";
import type { QueryClient } from "@tanstack/react-query";

export interface UseCourseEnrollmentActionInput {
  attempts: Attempt[] | undefined;
  course: CourseReadModel | null | undefined;
  lessonProgress: StudyRecord[] | undefined;
  assessmentItemsById?: Record<string, Array<Record<string, unknown>> | undefined>;
  queryClient: QueryClient;
  services: ApplicationServices;
}
