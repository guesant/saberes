import type { DiagnosisCode } from "@guesant/saberes-domain";

export interface ReviewDatabaseEvent {
  id: string;
  contentKey: string;
  rating: string;
  reviewedAt: string;
  diagnosis?: DiagnosisCode;
  elapsedMs?: number;
}
