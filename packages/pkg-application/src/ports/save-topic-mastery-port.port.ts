import type { StudyRecord } from "../models/index";

export interface SaveTopicMasteryPort {
  execute(input: { contentKey: string; data?: StudyRecord }): Promise<StudyRecord>;
}
