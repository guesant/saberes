import type { DiagnosisCode } from "@guesant/saberes-application";

export interface PerformanceDiagnosisStat {
  code: DiagnosisCode;
  attempts: number;
}
