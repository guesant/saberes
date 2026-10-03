import type { StudyRecord } from "../models/index.ts";
import type { SaveStreakPort } from "../ports/index.ts";

export class SaveStreakCommandHandler {
  public constructor(private readonly port: SaveStreakPort) {}

  public execute(data?: Record<string, unknown>): Promise<StudyRecord> {
    return this.port.execute(data);
  }
}
