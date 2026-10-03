import type { DiagnosisRecord } from "../models/index.ts";

export interface ListDiagnosesPort {
  execute(): Promise<DiagnosisRecord[]>;
}
