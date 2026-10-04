import { getQuestionSessionProgress } from "./get-question-session-progress.function";
import { getQuestionStudySessionState } from "./get-question-study-session-state.function";
import type { QuestionStudySessionActions } from "./question-study-session-actions.interface";
import type { QuestionStudySessionViewModel } from "./question-study-session-view-model.interface";
import type { QuestionSubmissionResult } from "./question-submission-result.interface";
import type { QuestionStudySessionData } from "./use-question-study-session-data.hook";

export interface CreateQuestionStudySessionViewModelInput {
  actions: QuestionStudySessionActions;
  data: QuestionStudySessionData;
}

export function createQuestionStudySessionViewModel(
  input: CreateQuestionStudySessionViewModelInput,
): QuestionStudySessionViewModel {
  const { actions, data } = input;

  return {
    state: getQuestionStudySessionState({
      failed: data.sessionQuery.isError,
      loading: data.sessionQuery.isLoading,
    }),
    session: data.session,
    question: data.question,
    progress: data.session ? getQuestionSessionProgress(data.session) : null,
    error: data.sessionQuery.error || data.question.error,
    reload: async (): Promise<void> => {
      await Promise.all([data.sessionQuery.refetch(), data.question.reload()]);
    },
    pause: async (): Promise<void> => {
      if (data.session) {
        await actions.pause(data.session);
      }
    },
    resume: async (): Promise<void> => {
      if (data.session) {
        await actions.resume(data.session);
      }
    },
    advance: async (result: QuestionSubmissionResult): Promise<void> => {
      if (data.session && data.questionKey) {
        await actions.advance(data.session, data.questionKey, result);
      }
    },
  };
}
