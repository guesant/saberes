import { getPersonalProgressQueryError } from "./get-personal-progress-query-error.function";
import { getPersonalProgressQueryPending } from "./get-personal-progress-query-pending.function";
import { usePersonalProgressAttemptsQuery } from "./use-personal-progress-attempts-query.hook";
import { usePersonalProgressGoalsQuery } from "./use-personal-progress-goals-query.hook";
import { usePersonalProgressSessionsQuery } from "./use-personal-progress-sessions-query.hook";
import type { PersonalProgressQueries } from "./personal-progress-queries.interface";
import type { ApplicationServices } from "@guesant/saberes-application";

export function usePersonalProgressQueries(services: ApplicationServices): PersonalProgressQueries {
  const attemptsQuery = usePersonalProgressAttemptsQuery(services);

  const sessionsQuery = usePersonalProgressSessionsQuery(services);

  const goalsQuery = usePersonalProgressGoalsQuery(services);

  return {
    attempts: attemptsQuery.data,
    error: getPersonalProgressQueryError(
      attemptsQuery.error,
      sessionsQuery.error,
      goalsQuery.error,
    ),
    goals: goalsQuery.data,
    isPending: getPersonalProgressQueryPending(
      attemptsQuery.isPending,
      sessionsQuery.isPending,
      goalsQuery.isPending,
    ),
    reload: async (): Promise<void> => {
      await Promise.all([attemptsQuery.refetch(), sessionsQuery.refetch(), goalsQuery.refetch()]);
    },
    sessions: sessionsQuery.data,
  };
}
