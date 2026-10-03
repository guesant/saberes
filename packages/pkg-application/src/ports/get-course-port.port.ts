import type { CourseReadModel } from "../models/content.models.ts";

export interface GetCoursePort {
  execute(slug: string): Promise<CourseReadModel | null>;
}
