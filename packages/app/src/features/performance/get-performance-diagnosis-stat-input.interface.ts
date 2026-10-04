import type { Attempt, DiagnosisCode, PedagogicalAction } from "@guesant/saberes-application";

export interface GetPerformanceDiagnosisStatInput {
  actionForDiagnosis(code: DiagnosisCode): PedagogicalAction;
  attempts: Attempt[];
  code: DiagnosisCode;
  count: number;
  now?: Date;
}
