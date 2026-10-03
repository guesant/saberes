import { syncAchievements } from "../../services/sync-achievements.service";
import type { SyncAchievementsPort } from "@guesant/saberes-application";

export class SyncAchievementsAdapter implements SyncAchievementsPort {
  public execute(
    input: Parameters<SyncAchievementsPort["execute"]>[0],
  ): ReturnType<SyncAchievementsPort["execute"]> {
    return syncAchievements(input);
  }
}
