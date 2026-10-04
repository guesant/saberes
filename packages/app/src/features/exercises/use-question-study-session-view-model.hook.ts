import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAppServices } from "../../composition/use-app-services.hook";
import { createQuestionStudySessionActions } from "./create-question-study-session-actions.function";
import { createQuestionStudySessionViewModel } from "./create-question-study-session-view-model.function";
import { useQuestionStudySessionData } from "./use-question-study-session-data.hook";
import type { QuestionStudySessionViewModel } from "./question-study-session-view-model.interface";

export function useQuestionStudySessionViewModel(
  sessionId: string | undefined,
): QuestionStudySessionViewModel {
  const services = useAppServices();

  const queryClient = useQueryClient();

  const data = useQuestionStudySessionData(sessionId);

  const actions = createQuestionStudySessionActions({ queryClient, services, sessionId });

  return useMemo(() => createQuestionStudySessionViewModel({ actions, data }), [actions, data]);
}
