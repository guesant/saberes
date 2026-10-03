import type { LessonReadModel } from "../models/index";
import type { GetLessonPort } from "../ports/index";
import type { ContentKey } from "@guesant/saberes-domain";

export class GetLessonQueryHandler {
  public constructor(private readonly port: GetLessonPort) {}

  public execute(key: ContentKey | string): Promise<LessonReadModel | null> {
    return this.port.execute(key);
  }
}
