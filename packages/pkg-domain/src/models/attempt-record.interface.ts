import type { ContentKey } from "./content.models.ts";
import type { DiagnosisCode } from "./domain.enums.ts";

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
  [key: string]: unknown;
}
