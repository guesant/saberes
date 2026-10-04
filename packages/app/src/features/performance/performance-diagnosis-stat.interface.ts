import type { DiagnosisCode, PedagogicalAction } from "@guesant/saberes-application";

export interface PerformanceDiagnosisStat {
  action: PedagogicalAction;
  code: DiagnosisCode;
  attempts: number;
}
