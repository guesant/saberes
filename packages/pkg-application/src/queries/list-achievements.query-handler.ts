import type { StudyRecord } from "../models/index";
import type { ListAchievementsPort } from "../ports/index";

export class ListAchievementsQueryHandler {
  public constructor(private readonly port: ListAchievementsPort) {}

  public execute(): Promise<StudyRecord[]> {
    return this.port.execute();
  }
}
