import { DexieProgressStore } from "./dexie-progress.store";
import type { SaveDailyChallengePort } from "@guesant/saberes-application";

export class SaveDailyChallengeAdapter implements SaveDailyChallengePort {
  public constructor(private readonly store: DexieProgressStore) {}

  public execute(
    input: Parameters<SaveDailyChallengePort["execute"]>[0],
  ): ReturnType<SaveDailyChallengePort["execute"]> {
    return this.store.saveDailyChallenge(input.contentKey, input.data);
  }
}
