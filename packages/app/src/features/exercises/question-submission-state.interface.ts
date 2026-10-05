import type { QuestionSubmissionResult } from "./question-submission-result.interface";
import type { ActionState } from "../../types/action-state.type";

export interface QuestionSubmissionState {
  error: Error | null;
  clearQuestionSubmission(): void;

  result: QuestionSubmissionResult | null;
  state: ActionState;
  submit(): Promise<void>;
}
