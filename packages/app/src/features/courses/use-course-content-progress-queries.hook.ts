import { getCourseItems } from "./get-course-items.function";
import { useCourseContentQuery } from "./use-course-content-query.hook";
import { useCourseProgressQueries } from "./use-course-progress-queries.hook";
import type { ApplicationServices } from "@guesant/saberes-application";

export function useCourseContentProgressQueries(
  services: ApplicationServices,
  slug: string | undefined,
) {
  const contentQuery = useCourseContentQuery({ services, slug });

  const items = getCourseItems(contentQuery.data);

  const progressQueries = useCourseProgressQueries(services, items);

  return { contentQuery, items, progressQueries };
}
