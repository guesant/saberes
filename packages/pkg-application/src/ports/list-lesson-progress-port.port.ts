import type { StudyRecord } from "../models/index";

export interface ListLessonProgressPort {
  execute(): Promise<StudyRecord[]>;
}
