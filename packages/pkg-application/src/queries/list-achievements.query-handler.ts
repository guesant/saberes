import type { StudyRecord } from "../models/index.ts";
import type { ListAchievementsPort } from "../ports/index.ts";

export class ListAchievementsQueryHandler {
  public constructor(private readonly port: ListAchievementsPort) {}

  public execute(): Promise<StudyRecord[]> {
    return this.port.execute();
  }
}
