import type { StudyRecord } from "../models/index.ts";

export interface SaveAchievementPort {
  execute(input: { contentKey: string; data?: Record<string, unknown> }): Promise<StudyRecord>;
}
