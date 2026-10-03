import type { StudyRecord } from "../models/index.ts";
import type { SaveDailyChallengePort } from "../ports/index.ts";

export class SaveDailyChallengeCommandHandler {
  public constructor(private readonly port: SaveDailyChallengePort) {}

  public execute(input: Parameters<SaveDailyChallengePort["execute"]>[0]): Promise<StudyRecord> {
    return this.port.execute(input);
  }
}
