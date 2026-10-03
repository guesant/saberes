import type { StudyRecord } from "../models/index.ts";
import type { ListDailyChallengesPort } from "../ports/index.ts";

export class ListDailyChallengesQueryHandler {
  public constructor(private readonly port: ListDailyChallengesPort) {}

  public execute(): Promise<StudyRecord[]> {
    return this.port.execute();
  }
}
