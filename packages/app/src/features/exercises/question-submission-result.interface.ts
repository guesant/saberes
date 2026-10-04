import type { AttemptConfidence } from "@guesant/saberes-application";

export interface QuestionSubmissionResult {
  attemptId: string;
  correct: boolean | null;
  confidence: AttemptConfidence;
}
