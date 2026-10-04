import { syncAchievements } from "../../services/sync-achievements.service";
import type { ProgressStorageContract } from "../../storage/progress-storage.contract";
import type { SyncAchievementsPort } from "@guesant/saberes-application";

export class SyncAchievementsAdapter implements SyncAchievementsPort {
  public constructor(private readonly storage: ProgressStorageContract) {}

  public execute(
    input: Parameters<SyncAchievementsPort["execute"]>[0],
  ): ReturnType<SyncAchievementsPort["execute"]> {
    return syncAchievements(this.storage, input);
  }
}
