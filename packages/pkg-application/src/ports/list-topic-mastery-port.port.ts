import type { StudyRecord } from "../models/index";

export interface ListTopicMasteryPort {
  execute(): Promise<StudyRecord[]>;
}
