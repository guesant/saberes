import type { StudyRecord } from "../models/index.ts";

export interface SaveDailyChallengePort {
  execute(input: { contentKey: string; data?: Record<string, unknown> }): Promise<StudyRecord>;
}
