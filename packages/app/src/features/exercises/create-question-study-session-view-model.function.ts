import { createQuestionStudySessionViewModelActions } from "./create-question-study-session-view-model-actions.function";
import { getQuestionSessionProgress } from "./get-question-session-progress.function";
import { getQuestionStudySessionState } from "./get-question-study-session-state.function";
import type { QuestionStudySessionActions } from "./question-study-session-actions.interface";
import type { QuestionStudySessionViewModel } from "./question-study-session-view-model.interface";
import type { QuestionStudySessionData } from "./use-question-study-session-data.hook";

export interface CreateQuestionStudySessionViewModelInput {
  actions: QuestionStudySessionActions;
  data: QuestionStudySessionData;
  remainingSeconds: number | null;
}

export function createQuestionStudySessionViewModel(
  input: CreateQuestionStudySessionViewModelInput,
): QuestionStudySessionViewModel {
  const { actions, data } = input;

  const viewModelActions = createQuestionStudySessionViewModelActions({ actions, data });

  return {
    state: getQuestionStudySessionState({
      failed: data.sessionQuery.isError,
      loading: data.sessionQuery.isLoading,
    }),
    session: data.session,
    question: data.question,
    progress: data.session ? getQuestionSessionProgress(data.session) : null,
    remainingSeconds: input.remainingSeconds,
    error: data.sessionQuery.error || data.question.error,
    ...viewModelActions,
  };
}
