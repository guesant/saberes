import type { ListAchievementsPort } from "../application.ports.ts";
import type { StudyRecord } from "../models/progress.models.ts";

export class ListAchievementsQueryHandler {
  public constructor(private readonly port: ListAchievementsPort) {}

  public execute(): Promise<StudyRecord[]> {
    return this.port.execute();
  }
}
