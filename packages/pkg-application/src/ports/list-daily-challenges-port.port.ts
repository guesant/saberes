import type { StudyRecord } from "../models/index";

export interface ListDailyChallengesPort {
  execute(): Promise<StudyRecord[]>;
}
