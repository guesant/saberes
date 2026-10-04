import { useQueryClient } from "@tanstack/react-query";
import type { ApplicationServices, StudySession } from "@guesant/saberes-application";

export interface SaveQuestionStudySessionActionInput {
  queryClient: ReturnType<typeof useQueryClient>;
  services: ApplicationServices;
  sessionId: string | undefined;
}

export type SaveQuestionStudySessionAction = (session: StudySession) => Promise<void>;

export function createSaveQuestionStudySessionAction(
  input: SaveQuestionStudySessionActionInput,
): SaveQuestionStudySessionAction {
  return async (session: StudySession): Promise<void> => {
    await input.services.progress.saveSession.execute(session);

    await input.queryClient.invalidateQueries({ queryKey: ["study-session", input.sessionId] });

    await input.queryClient.invalidateQueries({ queryKey: ["progress", "sessions"] });
  };
}
