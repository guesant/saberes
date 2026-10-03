import type { StudyRecord } from "../models/index.ts";

export interface RecordStudyActivityPort {
  execute(activity?: { at?: Date | string; type?: string }): Promise<StudyRecord>;
}
