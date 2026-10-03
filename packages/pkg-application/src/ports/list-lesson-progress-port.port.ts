import type { StudyRecord } from "../models/index.ts";

export interface ListLessonProgressPort {
  execute(): Promise<StudyRecord[]>;
}
