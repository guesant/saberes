import type { StudyRecord } from "../models/progress.models.ts";

export interface ListDailyChallengesPort {
  execute(): Promise<StudyRecord[]>;
}
