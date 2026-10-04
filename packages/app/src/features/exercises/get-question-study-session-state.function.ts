import type { QuestionStudySessionViewModelState } from "./question-study-session-view-model-state.type";

export interface GetQuestionStudySessionStateInput {
  loading: boolean;
  failed: boolean;
}

export function getQuestionStudySessionState(
  input: GetQuestionStudySessionStateInput,
): QuestionStudySessionViewModelState {
  if (input.loading) {
    return "loading";
  }

  if (input.failed) {
    return "error";
  }

  return "ready";
}
