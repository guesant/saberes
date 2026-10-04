import type { EnrollCourseCommandHandler } from "../commands/enroll-course.command-handler";
import type { GetCourseQueryHandler } from "../queries/get-course.query-handler";

export type CourseServices = {
  get: GetCourseQueryHandler;
  enroll: EnrollCourseCommandHandler;
};
