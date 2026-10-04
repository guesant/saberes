import type { SaveStudyRecordInput, StudyRecord } from "../models/index";

export interface SaveAchievementPort {
  execute(input: SaveStudyRecordInput): Promise<StudyRecord>;
}
