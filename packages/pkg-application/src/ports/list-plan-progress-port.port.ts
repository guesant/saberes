import type { StudyRecord } from "../models/progress.models.ts";

export interface ListPlanProgressPort {
  execute(): Promise<StudyRecord[]>;
}
