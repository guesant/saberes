import type { RecordStudyActivityInput, StudyRecord } from "../models/index";

export interface RecordStudyActivityPort {
  execute(activity?: RecordStudyActivityInput): Promise<StudyRecord>;
}
