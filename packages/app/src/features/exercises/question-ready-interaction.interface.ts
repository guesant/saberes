import type { QuestionSubmissionResult } from "./question-submission-result.interface";
import type { ActionState } from "../../types/action-state.type";
import type { AttemptConfidence } from "@guesant/saberes-application";

export interface QuestionReadyInteraction {
  answer: string | null;
  confidence: AttemptConfidence | null;
  result: QuestionSubmissionResult | null;
  submissionError: Error | null;
  submissionState: ActionState;
  changeAnswer(answer: string | null): void;

  changeConfidence(confidence: AttemptConfidence): void;

  submit(): Promise<void>;

  clear(): void;
}
