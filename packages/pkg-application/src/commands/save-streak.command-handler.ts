import type { SaveStreakPort } from "../application.ports.ts";
import type { StudyRecord } from "../models/progress.models.ts";

export class SaveStreakCommandHandler {
  public constructor(private readonly port: SaveStreakPort) {}

  public execute(data?: Record<string, unknown>): Promise<StudyRecord> {
    return this.port.execute(data);
  }
}
