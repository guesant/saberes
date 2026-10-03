import type { StudyRecord } from "../models/index";

export interface SaveStreakPort {
  execute(data?: Record<string, unknown>): Promise<StudyRecord>;
}
