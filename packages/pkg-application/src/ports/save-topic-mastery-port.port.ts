import type { SaveStudyRecordInput, StudyRecord } from "../models/index";

export interface SaveTopicMasteryPort {
  execute(input: SaveStudyRecordInput<StudyRecord>): Promise<StudyRecord>;
}
