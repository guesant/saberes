import type { GetPerformanceSessionMetricsInput } from "./get-performance-session-metrics-input.interface";
import type { PerformanceSessionMetrics } from "./performance-session-metrics.interface";

export function getPerformanceSessionMetrics(
  input: GetPerformanceSessionMetricsInput,
): PerformanceSessionMetrics {
  const completedSessions = input.sessions.filter((session) => {
    return session.status === "completed";
  });

  const studyMs = input.sessions.reduce((total, session) => {
    return total + (session.durationMs || 0);
  }, 0);

  return { completedSessions, studyMs };
}
