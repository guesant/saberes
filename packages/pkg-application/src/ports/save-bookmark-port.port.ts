import type { SaveStudyRecordInput, StudyRecord } from "../models/index";

export interface SaveBookmarkPort {
  execute(input: SaveStudyRecordInput): Promise<StudyRecord>;
}
