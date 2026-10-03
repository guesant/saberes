import type { StudyRecord } from "../models/progress.models.ts";

export interface ListBookmarksPort {
  execute(): Promise<StudyRecord[]>;
}
