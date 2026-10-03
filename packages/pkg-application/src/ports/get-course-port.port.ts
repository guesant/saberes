import type { CourseReadModel } from "../models/index";

export interface GetCoursePort {
  execute(slug: string): Promise<CourseReadModel | null>;
}
