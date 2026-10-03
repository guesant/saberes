import type { StudyRecord } from "../models/index.ts";

export interface ListPlanProgressPort {
  execute(): Promise<StudyRecord[]>;
}
