import { useQueryClient } from "@tanstack/react-query";
import { updateQuestionStudySession } from "./update-question-study-session.function";
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
  const saveSession = async (session: StudySession): Promise<void> => {
    await input.services.progress.saveSession.execute(session);

    await input.queryClient.invalidateQueries({ queryKey: ["study-session", input.sessionId] });

    await input.queryClient.invalidateQueries({ queryKey: ["progress", "sessions"] });
  };

  return {
    pause: (session: StudySession): Promise<void> => saveSession({ ...session, status: "paused" }),
    resume: (session: StudySession): Promise<void> => saveSession({ ...session, status: "active" }),
    advance: (
      session: StudySession,
      questionKey: string,
      result: QuestionSubmissionResult,
    ): Promise<void> =>
      saveSession(
        updateQuestionStudySession({
          session,
          questionKey,
          correct: result.correct,
          completedAt: new Date().toISOString(),
        }),
      ),
  };
}
