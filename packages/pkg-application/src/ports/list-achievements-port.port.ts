import type { StudyRecord } from "../models/index";

export interface ListAchievementsPort {
  execute(): Promise<StudyRecord[]>;
}
