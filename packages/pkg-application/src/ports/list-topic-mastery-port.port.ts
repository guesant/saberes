import type { StudyRecord } from "../models/progress.models.ts";

export interface ListTopicMasteryPort {
  execute(): Promise<StudyRecord[]>;
}
