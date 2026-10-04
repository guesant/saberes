import type { SaveStudyRecordInput, StudyRecord } from "../models/index";

export interface SaveReviewItemPort {
  execute(input: SaveStudyRecordInput): Promise<StudyRecord>;
}
