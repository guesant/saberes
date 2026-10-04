import { getPerformancePeriodDays } from "./get-performance-period-days.function";
import { getPerformanceSessionTime } from "./get-performance-session-time.function";
import { isPerformanceValueInPeriod } from "./is-performance-value-in-period.function";
import { matchesPerformanceScope } from "./matches-performance-scope.function";
import type { GetPerformanceFilteredDataInput } from "./get-performance-filtered-data-input.interface";
import type { StudySession } from "@guesant/saberes-application";

export function getPerformanceScopedSessions(
  sessions: StudySession[],
  filter: GetPerformanceFilteredDataInput["filter"],
  now: Date,
): StudySession[] {
  const periodDays = getPerformancePeriodDays(filter.period);

  return sessions.filter(
    (session) =>
      matchesPerformanceScope(session.contentKey, filter.scopeKey) &&
      isPerformanceValueInPeriod(getPerformanceSessionTime(session), periodDays, now),
  );
}
