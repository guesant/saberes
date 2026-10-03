import type { StudyRecord } from "../models/progress.models.ts";

export interface SaveDailyChallengePort {
  execute(input: { contentKey: string; data?: Record<string, unknown> }): Promise<StudyRecord>;
}
