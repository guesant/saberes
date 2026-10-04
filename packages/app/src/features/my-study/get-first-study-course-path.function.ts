import type { CatalogCard } from "@guesant/saberes-application";

export function getFirstStudyCoursePath(course: CatalogCard): string {
  return course.href || `/cursos/${course.slug || course.id}`;
}
