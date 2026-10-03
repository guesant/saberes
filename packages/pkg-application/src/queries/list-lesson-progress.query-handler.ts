import type { StudyRecord } from "../models/index.ts";
import type { ListLessonProgressPort } from "../ports/index.ts";

export class ListLessonProgressQueryHandler {
  public constructor(private readonly port: ListLessonProgressPort) {}

  public execute(): Promise<StudyRecord[]> {
    return this.port.execute();
  }
}
