import { startCourse } from "./start-course.function";
import type { AsyncAction } from "../../types/async-action.type";
import type { ApplicationServices, CourseReadModel } from "@guesant/saberes-application";
import type { QueryClient } from "@tanstack/react-query";

export type CreateStartCourseActionInput = {
  services: ApplicationServices;
  queryClient: QueryClient;
  course: CourseReadModel["course"] | undefined;
};

export function createStartCourseAction(
  input: CreateStartCourseActionInput,
): AsyncAction<[], void> {
  return async (): Promise<void> => {
    if (!input.course) {
      return;
    }

    await startCourse({ services: input.services, course: input.course });

    await input.queryClient.invalidateQueries({
      queryKey: ["progress", "enrollments"],
    });
  };
}
