import type { StudyRecord } from "../models/index";
import type { ListDailyChallengesPort } from "../ports/index";

export class ListDailyChallengesQueryHandler {
  public constructor(private readonly port: ListDailyChallengesPort) {}

  public execute(): Promise<StudyRecord[]> {
    return this.port.execute();
  }
}
