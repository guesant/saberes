import type { StudyRecord } from "../models/index.ts";

export interface ListTopicMasteryPort {
  execute(): Promise<StudyRecord[]>;
}
