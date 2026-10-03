import type { CourseReadModel } from "../models/index.ts";
import type { GetCoursePort } from "../ports/index.ts";

export class GetCourseQueryHandler {
  public constructor(private readonly port: GetCoursePort) {}

  public execute(slug: string): Promise<CourseReadModel | null> {
    return this.port.execute(slug);
  }
}
