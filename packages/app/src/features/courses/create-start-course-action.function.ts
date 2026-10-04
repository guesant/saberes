import { startCourse } from "./start-course.function";
import type { ApplicationServices, CourseReadModel } from "@guesant/saberes-application";
import type { QueryClient } from "@tanstack/react-query";

export type CreateStartCourseActionInput = {
  services: ApplicationServices;
  queryClient: QueryClient;
  course: CourseReadModel["course"] | undefined;
};

export function createStartCourseAction(input: CreateStartCourseActionInput): () => Promise<void> {
  return async (): Promise<void> => {
    if (!input.course) {
      return;
    }

    await startCourse({ services: input.services, course: input.course });

    await input.queryClient.invalidateQueries({ queryKey: ["progress", "enrollments"] });
  };
}
