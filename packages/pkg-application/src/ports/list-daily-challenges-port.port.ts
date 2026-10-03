import type { StudyRecord } from "../models/index.ts";

export interface ListDailyChallengesPort {
  execute(): Promise<StudyRecord[]>;
}
