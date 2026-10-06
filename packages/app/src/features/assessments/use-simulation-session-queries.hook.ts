import { useQuery } from "@tanstack/react-query";
import { useAppServices } from "../../composition/use-app-services.hook";
import { getCurrentSimulationQuestionKey } from "./get-current-simulation-question-key.function";
import { getSimulationQueryError } from "./get-simulation-query-error.function";
import { isAnySimulationQueryLoading } from "./is-any-simulation-query-loading.function";
import { shouldLoadSimulationQuestion } from "./should-load-simulation-question.function";
import type { SimulationSessionQueriesViewModel } from "./simulation-session-queries-view-model.interface";

export function useSimulationSessionQueries(sessionId: string): SimulationSessionQueriesViewModel {
  const services = useAppServices();

  const sessionQuery = useQuery({
    queryKey: ["study-session", sessionId],
    queryFn: async () => { return await services.progress.getSession.execute(sessionId) ?? null; },
  });

  const session = sessionQuery.data ?? null;

  const questionKey = getCurrentSimulationQuestionKey(session);

  const questionQuery = useQuery({
    queryKey: ["question", questionKey],
    enabled: shouldLoadSimulationQuestion(questionKey, session),
    queryFn: () => { return services.exercises.get.execute(questionKey); },
  });

  const reload = async (): Promise<void> => {
    await sessionQuery.refetch();

    await questionQuery.refetch();
  };

  return {
    session,
    question: questionQuery.data ?? null,
    questionKey,
    loading: isAnySimulationQueryLoading(sessionQuery.isLoading, questionQuery.isLoading),
    error: getSimulationQueryError(sessionQuery.error, questionQuery.error),
    reload,
  };
}
