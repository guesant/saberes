import type { StudyRecord } from "../models/index.ts";

export interface ListEnrollmentsPort {
  execute(): Promise<StudyRecord[]>;
}
