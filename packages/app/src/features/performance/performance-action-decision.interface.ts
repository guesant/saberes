import type { DiagnosisCode, PedagogicalAction } from "@guesant/saberes-application";

export interface PerformanceActionDecision {
  action: PedagogicalAction | "deferred" | "ignored";
  code: DiagnosisCode;
  decidedAt: string;
}
