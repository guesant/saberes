import type { StudyRecord } from "../models/progress.models.ts";

export interface SaveAchievementPort {
  execute(input: { contentKey: string; data?: Record<string, unknown> }): Promise<StudyRecord>;
}
