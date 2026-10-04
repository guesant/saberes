import { getPerformancePeriodDays } from "./get-performance-period-days.function";
import { isPerformanceValueInPeriod } from "./is-performance-value-in-period.function";
import { matchesPerformanceScope } from "./matches-performance-scope.function";
import type { GetPerformanceScopedAttemptsInput } from "./get-performance-scoped-attempts-input.interface";
import type { Attempt } from "@guesant/saberes-application";

export function getPerformanceScopedAttempts(input: GetPerformanceScopedAttemptsInput): Attempt[] {
  const periodDays = getPerformancePeriodDays(input.filter.period);

  const sessionIds = new Set(
    input.sessions.map((session) => {
      return session.id;
    }),
  );

  return input.attempts.filter((attempt) => {
    return (
      isPerformanceValueInPeriod(attempt.answeredAt, periodDays, input.now) &&
      (matchesPerformanceScope(attempt.contentKey, input.filter.scopeKey) ||
        (attempt.sessionId !== undefined && sessionIds.has(attempt.sessionId)))
    );
  });
}
