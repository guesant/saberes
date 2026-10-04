import type { SaveStudyRecordInput, StudyRecord } from "../models/index";

export interface SaveLessonProgressPort {
  execute(input: SaveStudyRecordInput): Promise<StudyRecord>;
}
