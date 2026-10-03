import type { StudyRecord } from "../models/index.ts";

export interface SaveStreakPort {
  execute(data?: Record<string, unknown>): Promise<StudyRecord>;
}
