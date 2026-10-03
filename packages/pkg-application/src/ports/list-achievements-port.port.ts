import type { StudyRecord } from "../models/progress.models.ts";

export interface ListAchievementsPort {
  execute(): Promise<StudyRecord[]>;
}
