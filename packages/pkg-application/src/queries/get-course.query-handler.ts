import type { CourseReadModel } from "../models/index";
import type { GetCoursePort } from "../ports/index";

export class GetCourseQueryHandler {
  public constructor(private readonly port: GetCoursePort) {}

  public execute(slug: string): Promise<CourseReadModel | null> {
    return this.port.execute(slug);
  }
}
