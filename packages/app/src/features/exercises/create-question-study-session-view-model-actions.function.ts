import type { QuestionStudySessionActions } from "./question-study-session-actions.interface";
import type { QuestionStudySessionViewModel } from "./question-study-session-view-model.interface";
import type { QuestionSubmissionResult } from "./question-submission-result.interface";
import type { QuestionStudySessionData } from "./use-question-study-session-data.hook";

export interface CreateQuestionStudySessionViewModelActionsInput {
  actions: QuestionStudySessionActions;
  data: QuestionStudySessionData;
}

export function createQuestionStudySessionViewModelActions(
  input: CreateQuestionStudySessionViewModelActionsInput,
): Pick<QuestionStudySessionViewModel, "reload" | "pause" | "resume" | "advance" | "skip"> {
  const { actions, data } = input;

  return {
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
    skip: async (): Promise<void> => {
      if (data.session && data.questionKey) {
        await actions.skip(data.session, data.questionKey);
      }
    },
  };
}
