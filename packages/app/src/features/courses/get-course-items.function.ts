import type { CourseReadModel } from "@guesant/saberes-application";

export function getCourseItems(
  data: CourseReadModel | null | undefined,
): Array<Record<string, unknown>> {
  return data?.items || [];
}
