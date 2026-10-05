import { useQuery } from "@tanstack/react-query";
import { loadCourse } from "./load-course.function";
import type { UseCourseContentQueryInput } from "./use-course-content-query-input.interface";

export function useCourseContentQuery(input: UseCourseContentQueryInput) {
  return useQuery({
    queryKey: ["course", input.slug],
    enabled: Boolean(input.slug),
    queryFn: () => {
      return loadCourse({ services: input.services, slug: input.slug });
    },
  });
}
