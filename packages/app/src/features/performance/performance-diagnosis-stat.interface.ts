import type { DiagnosisCode, PedagogicalAction } from "@guesant/saberes-application";

export interface PerformanceDiagnosisStat {
  action: PedagogicalAction;
  code: DiagnosisCode;
  attempts: number;
  recentAttempts: number;
  topicCount: number;
  questionCount: number;
  sessionCount: number;
}
