import { useQueryClient } from "@tanstack/react-query";
import { useAppServices } from "../../composition/use-app-services.hook";
import { useQuestionStudySessionCountdown } from "../exercises/use-question-study-session-countdown.hook";
import { createSimulationSessionViewModel } from "./create-simulation-session-view-model.function";
import { useSimulationSessionAnswer } from "./use-simulation-session-answer.hook";
import { useSimulationSessionCompletion } from "./use-simulation-session-completion.hook";
import { useSimulationSessionQueries } from "./use-simulation-session-queries.hook";
import { useSimulationSessionUpdater } from "./use-simulation-session-updater.hook";
import type { SimulationSessionViewModel } from "./simulation-session-view-model.interface";

export function useSimulationSessionViewModel(sessionId: string): SimulationSessionViewModel {
  const services = useAppServices();

  const client = useQueryClient();

  const query = useSimulationSessionQueries(sessionId);

  const remainingSeconds = useQuestionStudySessionCountdown({ session: query.session });

  const updater = useSimulationSessionUpdater({ sessionId, services, client });

  const completion = useSimulationSessionCompletion({
    sessionId,
    session: query.session,
    remainingSeconds,
    updater,
    services,
    client,
  });

  const answer = useSimulationSessionAnswer({
    session: query.session,
    sessionId,
    questionKey: query.questionKey,
    remainingSeconds,
    finishing: completion.finishing,
    update: updater.update,
  });

  return createSimulationSessionViewModel({ sessionId, query, remainingSeconds, updater, completion, answer });
}
