import type { QuestionSubmissionResult } from "./question-submission-result.interface";
import type { AttemptConfidence } from "@guesant/saberes-application";
import type { MutableRefObject } from "react";

export interface UseQuestionSubmissionInput {
  answer: string | null;
  confidence: AttemptConfidence | null;
  startedAt: MutableRefObject<number>;
  onSubmit(
    answer: string,
    elapsedMs: number,
    confidence: AttemptConfidence,
  ): Promise<QuestionSubmissionResult>;
}
