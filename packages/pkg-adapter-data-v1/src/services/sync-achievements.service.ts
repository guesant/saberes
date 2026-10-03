import { defineAchievements, type AchievementStats } from "@guesant/saberes-domain";
import { progressDb } from "../storage/progress.storage";

export async function syncAchievements(stats: AchievementStats = {}) {
  const achievements = defineAchievements(stats);

  await Promise.all(
    achievements
      .filter((item) => item.isUnlocked)
      .map((item) =>
        progressDb.saveAchievement(`achievement:${item.key}`, {
          ...item,
          unlockedAt: new Date().toISOString(),
        }),
      ),
  );

  return achievements;
}
