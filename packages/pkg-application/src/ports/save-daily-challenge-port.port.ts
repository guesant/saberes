import type { StudyRecord } from "../models/index";

export interface SaveDailyChallengePort {
  execute(input: { contentKey: string; data?: Record<string, unknown> }): Promise<StudyRecord>;
}
