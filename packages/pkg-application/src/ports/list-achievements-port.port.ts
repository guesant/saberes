import type { StudyRecord } from "../models/index.ts";

export interface ListAchievementsPort {
  execute(): Promise<StudyRecord[]>;
}
