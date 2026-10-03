import type { DiagnosisRecord } from "@guesant/saberes-domain";

export interface ListDiagnosesPort {
  execute(): Promise<DiagnosisRecord[]>;
}
