import type { StudyRecord } from "../models/index.ts";
import type { SaveLessonProgressPort } from "../ports/index.ts";

export class SaveLessonProgressCommandHandler {
  public constructor(private readonly port: SaveLessonProgressPort) {}

  public execute(input: Parameters<SaveLessonProgressPort["execute"]>[0]): Promise<StudyRecord> {
    return this.port.execute(input);
  }
}
