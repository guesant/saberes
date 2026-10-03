import type { DiagnosisRecord } from "../models/progress.models.ts";

export interface ListDiagnosesPort {
  execute(): Promise<DiagnosisRecord[]>;
}
