import type { StudyRecord } from "../models/progress.models.ts";

export interface SaveStreakPort {
  execute(data?: Record<string, unknown>): Promise<StudyRecord>;
}
