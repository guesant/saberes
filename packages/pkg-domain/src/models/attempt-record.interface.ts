import type { ContentKey } from "./content-key.type";
import type { AttemptConfidence, DiagnosisCode } from "./domain.enums";

export interface AttemptRecord {
  id?: string;
  contentKey?: ContentKey | string;
  questionId?: number | string;
  topicIds?: Array<number | string>;
  answer?: unknown;
  isCorrect?: boolean | null;
  elapsedMs?: number;
  attemptNumber?: number;
  sessionId?: string;
  source?: string;
  answeredAt?: string;
  diagnosis?: DiagnosisCode;
  confidence?: AttemptConfidence;
  [key: string]: unknown;
}
