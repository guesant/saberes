import type { StudyRecord } from "../models/index";

export interface GetStreakPort {
  execute(): Promise<StudyRecord | undefined>;
}
