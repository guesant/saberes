import type { GetCoursePort } from "../application.ports.ts";
import type { CourseReadModel } from "../models/content.models.ts";

export class GetCourseQueryHandler {
  public constructor(private readonly port: GetCoursePort) {}

  public execute(slug: string): Promise<CourseReadModel | null> {
    return this.port.execute(slug);
  }
}
