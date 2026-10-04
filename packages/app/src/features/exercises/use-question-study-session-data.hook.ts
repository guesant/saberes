import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { useAppServices } from "../../composition/use-app-services.hook";
import { getQuestionSessionCurrentIndex } from "./get-question-session-current-index.function";
import { useQuestionViewModel } from "./question.view-model";
import type { StudySession } from "@guesant/saberes-application";

export interface QuestionStudySessionData {
  question: ReturnType<typeof useQuestionViewModel>;
  questionKey: string | undefined;
  session: StudySession | null;
  sessionQuery: UseQueryResult<StudySession | undefined, Error>;
}

export function useQuestionStudySessionData(
  sessionId: string | undefined,
): QuestionStudySessionData {
  const services = useAppServices();

  const sessionQuery = useQuery({
    queryKey: ["study-session", sessionId],
    enabled: Boolean(sessionId),
    queryFn: () => services.progress.getSession.execute(sessionId || ""),
  });

  const session = sessionQuery.data || null;

  const currentIndex = getQuestionSessionCurrentIndex(session);

  const questionKey = session?.questionKeys?.[currentIndex];

  const question = useQuestionViewModel(questionKey, sessionId);

  return { question, questionKey, session, sessionQuery };
}
