import type { StudyRecord } from "../models/index.ts";

export interface ListBookmarksPort {
  execute(): Promise<StudyRecord[]>;
}
