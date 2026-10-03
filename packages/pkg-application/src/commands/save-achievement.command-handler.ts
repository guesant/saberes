import type { StudyRecord } from "../models/index.ts";
import type { SaveAchievementPort } from "../ports/index.ts";

export class SaveAchievementCommandHandler {
  public constructor(private readonly port: SaveAchievementPort) {}

  public execute(input: Parameters<SaveAchievementPort["execute"]>[0]): Promise<StudyRecord> {
    return this.port.execute(input);
  }
}
