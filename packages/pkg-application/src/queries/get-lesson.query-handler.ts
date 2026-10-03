import type { GetLessonPort } from "../application.ports.ts";
import type { ContentKey, LessonReadModel } from "../models/content.models.ts";

export class GetLessonQueryHandler {
  public constructor(private readonly port: GetLessonPort) {}

  public execute(key: ContentKey | string): Promise<LessonReadModel | null> {
    return this.port.execute(key);
  }
}
