import type { CourseReadModel } from "@guesant/saberes-application";

export function getCourseSlug(course: CourseReadModel | null | undefined): string | undefined {
  if (!course?.course.slug) {
    return undefined;
  }

  return String(course.course.slug);
}
