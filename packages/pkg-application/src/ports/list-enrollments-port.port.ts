import type { StudyRecord } from "../models/progress.models.ts";

export interface ListEnrollmentsPort {
  execute(): Promise<StudyRecord[]>;
}
