import type { Attempt, DiagnosisCode, PedagogicalAction } from "@guesant/saberes-application";

export interface GetPerformanceDiagnosisStatsInput {
  actionForDiagnosis: (code: DiagnosisCode) => PedagogicalAction;
  attempts: Attempt[];
}
