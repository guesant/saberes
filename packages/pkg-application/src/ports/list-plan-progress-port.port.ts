import type { StudyRecord } from "../models/index";

export interface ListPlanProgressPort {
  execute(): Promise<StudyRecord[]>;
}
