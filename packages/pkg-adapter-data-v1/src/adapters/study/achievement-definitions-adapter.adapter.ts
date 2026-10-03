import { defineAchievements } from "@guesant/saberes-domain";
import type { AchievementDefinitionsPort } from "@guesant/saberes-application";

export class AchievementDefinitionsAdapter implements AchievementDefinitionsPort {
  public execute(
    input: Parameters<AchievementDefinitionsPort["execute"]>[0],
  ): ReturnType<AchievementDefinitionsPort["execute"]> {
    return defineAchievements(input);
  }
}
