import type { SaveAchievementPort } from "../application.ports.ts";
import type { StudyRecord } from "../models/progress.models.ts";

export class SaveAchievementCommandHandler {
  public constructor(private readonly port: SaveAchievementPort) {}

  public execute(input: Parameters<SaveAchievementPort["execute"]>[0]): Promise<StudyRecord> {
    return this.port.execute(input);
  }
}
