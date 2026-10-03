import type { StudyRecord } from "../models/index";
import type { ListLessonProgressPort } from "../ports/index";

export class ListLessonProgressQueryHandler {
  public constructor(private readonly port: ListLessonProgressPort) {}

  public execute(): Promise<StudyRecord[]> {
    return this.port.execute();
  }
}
