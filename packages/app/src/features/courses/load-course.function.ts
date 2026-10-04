import type { ApplicationServices, CourseReadModel } from "@guesant/saberes-application";

export type LoadCourseInput = {
  services: ApplicationServices;
  slug: string | undefined;
};

export function loadCourse(input: LoadCourseInput): Promise<CourseReadModel | null> {
  if (!input.slug) {
    return Promise.resolve(null);
  }

  return input.services.courses.get.execute(input.slug);
}
