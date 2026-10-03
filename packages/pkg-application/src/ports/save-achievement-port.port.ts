import type { StudyRecord } from "../models/index";

export interface SaveAchievementPort {
  execute(input: { contentKey: string; data?: Record<string, unknown> }): Promise<StudyRecord>;
}
