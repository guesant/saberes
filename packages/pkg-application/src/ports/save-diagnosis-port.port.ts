import type { DiagnosisRecord } from "../models/progress.models.ts";

export interface SaveDiagnosisPort {
  execute(diagnosis: DiagnosisRecord): Promise<void>;
}
