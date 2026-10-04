import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { SaveAchievementPort } from "@guesant/saberes-application";

export class SaveAchievementAdapter implements SaveAchievementPort {
  public constructor(private readonly store: ProgressStorageContract) {}

  public execute(
    input: Parameters<SaveAchievementPort["execute"]>[0],
  ): ReturnType<SaveAchievementPort["execute"]> {
    return this.store.saveAchievement(input.contentKey, input.data);
  }
}
