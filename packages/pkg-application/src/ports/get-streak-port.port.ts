import type { StudyRecord } from "../models/progress.models.ts";

export interface GetStreakPort {
  execute(): Promise<StudyRecord | undefined>;
}
