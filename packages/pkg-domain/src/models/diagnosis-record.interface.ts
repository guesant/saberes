import type {
  DiagnosisCode,
  DiagnosisConfidence,
  DiagnosisSource,
  PedagogicalAction,
} from "./domain.enums";

export interface DiagnosisRecord {
  attemptId: string;
  code: DiagnosisCode;
  confidence?: DiagnosisConfidence;
  suggestedBy?: DiagnosisSource;
  action?: PedagogicalAction;
  createdAt?: string;
}
