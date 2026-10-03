import type { StudyRecord } from "../models/progress.models.ts";

export interface RecordStudyActivityPort {
  execute(activity?: { at?: Date | string; type?: string }): Promise<StudyRecord>;
}
