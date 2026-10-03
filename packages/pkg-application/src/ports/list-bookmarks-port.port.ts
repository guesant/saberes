import type { StudyRecord } from "../models/index";

export interface ListBookmarksPort {
  execute(): Promise<StudyRecord[]>;
}
