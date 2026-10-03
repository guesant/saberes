import type {
  DiagnosisCode,
  DiagnosisConfidence,
  DiagnosisSource,
  PedagogicalAction,
} from "@guesant/saberes-domain";

export interface AttemptDiagnosis {
  attemptId: string;
  code: DiagnosisCode;
  confidence?: DiagnosisConfidence;
  suggestedBy?: DiagnosisSource;
  action?: PedagogicalAction;
  createdAt?: string;
}
