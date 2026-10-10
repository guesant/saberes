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
  /** Training target and source context captured when the attempt was answered. */
  targetEditionKey?: string;
  targetStageKey?: string;
  sourceEditionKey?: string;
  sourceStageKey?: string;
  canonicalQuestionId?: number | string;
  questionContentVersion?: string;
  answerKeyVersion?: string;
  subjectIds?: Array<number | string>;
  skillIds?: Array<number | string>;
  hintIdsUsed?: Array<number | string>;
  studyMode?: "assisted" | "unassisted" | "simulation";
  assisted?: boolean;
  [key: string]: unknown;
}
