import { useQueryClient } from "@tanstack/react-query";
import { createAdvanceQuestionStudySessionAction } from "./create-advance-question-study-session-action.function";
import { createCompleteQuestionStudySessionAction } from "./create-complete-question-study-session-action.function";
import { createPauseQuestionStudySessionAction } from "./create-pause-question-study-session-action.function";
import { createResumeQuestionStudySessionAction } from "./create-resume-question-study-session-action.function";
import { createSaveQuestionStudySessionAction } from "./create-save-question-study-session-action.function";
import { createSkipQuestionStudySessionAction } from "./create-skip-question-study-session-action.function";
import type { QuestionStudySessionActions } from "./question-study-session-actions.interface";
import type { QuestionSubmissionResult } from "./question-submission-result.interface";
import type { ApplicationServices, StudySession } from "@guesant/saberes-application";

export interface CreateQuestionStudySessionActionsInput {
  queryClient: ReturnType<typeof useQueryClient>;
  services: ApplicationServices;
  sessionId: string | undefined;
}

export function createQuestionStudySessionActions(
  input: CreateQuestionStudySessionActionsInput,
): QuestionStudySessionActions {
  const saveSession = createSaveQuestionStudySessionAction(input);

  return {
    advance: (session: StudySession, questionKey: string, result: QuestionSubmissionResult) =>
      createAdvanceQuestionStudySessionAction(saveSession)({ questionKey, result, session }),
    complete: createCompleteQuestionStudySessionAction(saveSession),
    pause: createPauseQuestionStudySessionAction(saveSession),
    resume: createResumeQuestionStudySessionAction(saveSession),
    skip: (session: StudySession, questionKey: string) =>
      createSkipQuestionStudySessionAction(saveSession)({ questionKey, session }),
  };
}
