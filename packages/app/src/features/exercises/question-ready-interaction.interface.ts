import type { QuestionSubmissionResult } from "./question-submission-result.interface";
import type { AttemptConfidence } from "@guesant/saberes-application";

export interface QuestionReadyInteraction {
  answer: string | null;
  confidence: AttemptConfidence | null;
  result: QuestionSubmissionResult | null;
  changeAnswer: (answer: string | null) => void;
  changeConfidence: (confidence: AttemptConfidence) => void;
  submit: () => Promise<void>;
  clear: () => void;
}
