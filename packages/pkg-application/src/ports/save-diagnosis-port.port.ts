import type { DiagnosisRecord } from "@guesant/saberes-domain";

export interface SaveDiagnosisPort {
  execute(diagnosis: DiagnosisRecord): Promise<void>;
}
