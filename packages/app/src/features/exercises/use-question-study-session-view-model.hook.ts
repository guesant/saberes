import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";
import { useAppServices } from "../../composition/use-app-services.hook";
import { createQuestionStudySessionActions } from "./create-question-study-session-actions.function";
import { createQuestionStudySessionViewModel } from "./create-question-study-session-view-model.function";
import { useQuestionStudySessionCountdown } from "./use-question-study-session-countdown.hook";
import { useQuestionStudySessionData } from "./use-question-study-session-data.hook";
import type { QuestionStudySessionViewModel } from "./question-study-session-view-model.interface";

export function useQuestionStudySessionViewModel(
  sessionId: string | undefined,
): QuestionStudySessionViewModel {
  const services = useAppServices();

  const queryClient = useQueryClient();

  const data = useQuestionStudySessionData(sessionId);

  const remainingSeconds = useQuestionStudySessionCountdown({ session: data.session });

  const completionRequested = useRef(false);

  const actions = createQuestionStudySessionActions({ queryClient, services, sessionId });

  useEffect(() => {
    if (
      remainingSeconds !== 0 ||
      !data.session ||
      data.session.status !== "active" ||
      completionRequested.current
    ) {
      return;
    }

    completionRequested.current = true;

    actions.complete(data.session).catch(() => undefined);
  }, [actions, data.session, remainingSeconds]);

  return useMemo(
    () => createQuestionStudySessionViewModel({ actions, data, remainingSeconds }),
    [actions, data, remainingSeconds],
  );
}
