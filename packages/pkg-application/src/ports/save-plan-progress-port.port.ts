import type { SaveStudyRecordInput, StudyRecord } from "../models/index";

export interface SavePlanProgressPort {
  execute(input: SaveStudyRecordInput): Promise<StudyRecord>;
}
