import type { StudyRecord } from "../models/index";
import type { SaveStreakPort } from "../ports/index";

export class SaveStreakCommandHandler {
  public constructor(private readonly port: SaveStreakPort) {}

  public execute(data?: Record<string, unknown>): Promise<StudyRecord> {
    return this.port.execute(data);
  }
}
