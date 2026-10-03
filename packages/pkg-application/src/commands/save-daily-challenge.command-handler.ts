import type { SaveDailyChallengePort } from "../application.ports.ts";
import type { StudyRecord } from "../models/progress.models.ts";

export class SaveDailyChallengeCommandHandler {
  public constructor(private readonly port: SaveDailyChallengePort) {}

  public execute(input: Parameters<SaveDailyChallengePort["execute"]>[0]): Promise<StudyRecord> {
    return this.port.execute(input);
  }
}
