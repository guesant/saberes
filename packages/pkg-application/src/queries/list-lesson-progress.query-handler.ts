import type { ListLessonProgressPort } from "../application.ports.ts";
import type { StudyRecord } from "../models/progress.models.ts";

export class ListLessonProgressQueryHandler {
  public constructor(private readonly port: ListLessonProgressPort) {}

  public execute(): Promise<StudyRecord[]> {
    return this.port.execute();
  }
}
