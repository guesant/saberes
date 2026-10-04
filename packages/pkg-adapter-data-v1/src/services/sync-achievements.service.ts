import { defineAchievements, type AchievementStats } from "@guesant/saberes-domain";
import type { ProgressStorageContract } from "../storage/progress-storage.contract";

export async function syncAchievements(
  storage: ProgressStorageContract,
  stats: AchievementStats = {},
) {
  const achievements = defineAchievements(stats);

  await Promise.all(
    achievements
      .filter((item) => {
        return item.isUnlocked;
      })
      .map((item) => {
        return storage.saveAchievement(`achievement:${item.key}`, {
          ...item,
          unlockedAt: new Date()
            .toISOString(),
        });
      }),
  );

  return achievements;
}
