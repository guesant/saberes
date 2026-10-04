import { getPerformanceScopedAttempts } from "./get-performance-scoped-attempts.function";
import { getPerformanceScopedSessions } from "./get-performance-scoped-sessions.function";
import type { GetPerformanceFilteredDataInput } from "./get-performance-filtered-data-input.interface";
import type { PerformanceFilteredData } from "./performance-filtered-data.interface";

export function getPerformanceFilteredData(
  input: GetPerformanceFilteredDataInput,
): PerformanceFilteredData {
  const sessions = getPerformanceScopedSessions(input.sessions, input.filter, input.now);

  return {
    attempts: getPerformanceScopedAttempts({
      attempts: input.attempts,
      filter: input.filter,
      now: input.now,
      sessions,
    }),
    sessions,
  };
}
