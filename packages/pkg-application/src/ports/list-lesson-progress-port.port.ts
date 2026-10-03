import type { StudyRecord } from "../models/progress.models.ts";

export interface ListLessonProgressPort {
  execute(): Promise<StudyRecord[]>;
}
