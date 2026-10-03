import type { DiagnosisRecord } from "../models/index.ts";

export interface SaveDiagnosisPort {
  execute(diagnosis: DiagnosisRecord): Promise<void>;
}
