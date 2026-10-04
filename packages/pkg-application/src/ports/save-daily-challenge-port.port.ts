import type { SaveStudyRecordInput, StudyRecord } from "../models/index";

export interface SaveDailyChallengePort {
  execute(input: SaveStudyRecordInput): Promise<StudyRecord>;
}
