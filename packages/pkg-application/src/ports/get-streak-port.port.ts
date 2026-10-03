import type { StudyRecord } from "../models/index.ts";

export interface GetStreakPort {
  execute(): Promise<StudyRecord | undefined>;
}
