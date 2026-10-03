import type { StudyRecord } from "../models/index";
import type { SaveLessonProgressPort } from "../ports/index";

export class SaveLessonProgressCommandHandler {
  public constructor(private readonly port: SaveLessonProgressPort) {}

  public execute(input: Parameters<SaveLessonProgressPort["execute"]>[0]): Promise<StudyRecord> {
    return this.port.execute(input);
  }
}
