import { differenceInCalendarDays, parseISO } from "date-fns";
import type { GetPerformanceAttemptMetricsInput } from "./get-performance-attempt-metrics-input.interface";
import type { PerformanceAttemptMetrics } from "./performance-attempt-metrics.interface";

export function getPerformanceAttemptMetrics(
  input: GetPerformanceAttemptMetricsInput,
): PerformanceAttemptMetrics {
  const recentAttempts = input.attempts.filter((attempt) => {
    return (
      attempt.answeredAt && differenceInCalendarDays(input.now, parseISO(attempt.answeredAt)) <= 6
    );
  });

  const correctedAttempts = input.attempts.filter((attempt) => {
    return attempt.isCorrect !== null;
  });

  const correctAttempts = input.attempts.filter((attempt) => {
    return attempt.isCorrect === true;
  });

  const elapsedAttempts = input.attempts.filter((attempt) => {
    return typeof attempt.elapsedMs === "number" && attempt.elapsedMs > 0;
  });

  const elapsedMs = elapsedAttempts.reduce((total, attempt) => {
    return total + (attempt.elapsedMs || 0);
  }, 0);

  return { correctedAttempts, correctAttempts, elapsedAttempts, elapsedMs, recentAttempts };
}
