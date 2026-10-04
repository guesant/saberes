import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { SaveDailyChallengePort } from "@guesant/saberes-application";

export class SaveDailyChallengeAdapter implements SaveDailyChallengePort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(
    input: Parameters<SaveDailyChallengePort["execute"]>[0],
  ): ReturnType<SaveDailyChallengePort["execute"]> {
    return this.store.saveDailyChallenge(input.contentKey, input.data);
  }
}
