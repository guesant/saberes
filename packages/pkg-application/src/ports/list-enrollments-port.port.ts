import type { StudyRecord } from "../models/index";

export interface ListEnrollmentsPort {
  execute(): Promise<StudyRecord[]>;
}
