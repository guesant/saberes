import type { SaveLessonProgressPort } from "../application.ports.ts";
import type { StudyRecord } from "../models/progress.models.ts";

export class SaveLessonProgressCommandHandler {
  public constructor(private readonly port: SaveLessonProgressPort) {}

  public execute(input: Parameters<SaveLessonProgressPort["execute"]>[0]): Promise<StudyRecord> {
    return this.port.execute(input);
  }
}
