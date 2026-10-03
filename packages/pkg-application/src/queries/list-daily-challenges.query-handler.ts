import type { ListDailyChallengesPort } from "../application.ports.ts";
import type { StudyRecord } from "../models/progress.models.ts";

export class ListDailyChallengesQueryHandler {
  public constructor(private readonly port: ListDailyChallengesPort) {}

  public execute(): Promise<StudyRecord[]> {
    return this.port.execute();
  }
}
