import type { ContentKey, LessonReadModel } from "../models/index.ts";
import type { GetLessonPort } from "../ports/index.ts";

export class GetLessonQueryHandler {
  public constructor(private readonly port: GetLessonPort) {}

  public execute(key: ContentKey | string): Promise<LessonReadModel | null> {
    return this.port.execute(key);
  }
}
