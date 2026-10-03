import type { ApplicationServices, CourseReadModel } from "@guesant/saberes-application";

export interface StartCourseInput {
  services: ApplicationServices;
  course: CourseReadModel["course"];
}

export async function startCourse(input: StartCourseInput): Promise<void> {
  await input.services.courses.enroll.execute({
    contentKey: `course:${String(input.course.slug)}`,
    data: {
      courseId: input.course.id,
      slug: input.course.slug,
      title: input.course.title,
    },
  });
}
