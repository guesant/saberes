import type { CourseReadModel } from "../models/index.ts";

export interface GetCoursePort {
  execute(slug: string): Promise<CourseReadModel | null>;
}
