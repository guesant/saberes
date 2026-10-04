import { differenceInCalendarDays, parseISO } from "date-fns";
import type { GetPerformanceSummaryInput } from "./get-performance-summary-input.interface";
import type { PerformanceSummary } from "./performance-summary.interface";

export function getPerformanceSummary(input: GetPerformanceSummaryInput): PerformanceSummary {
  const recentAttempts = input.attempts.filter((attempt) => {
    if (!attempt.answeredAt) {
      return false;
    }

    return differenceInCalendarDays(input.now, parseISO(attempt.answeredAt)) <= 6;
  });

  const correctedAttempts = input.attempts.filter((attempt) => attempt.isCorrect !== null);

  const correctAttempts = input.attempts.filter((attempt) => attempt.isCorrect === true);

  const elapsedAttempts = input.attempts.filter(
    (attempt) => typeof attempt.elapsedMs === "number" && attempt.elapsedMs > 0,
  );

  const elapsedMs = elapsedAttempts.reduce((total, attempt) => total + (attempt.elapsedMs || 0), 0);

  const completedSessions = input.sessions.filter((session) => session.status === "completed");

  const studyMs = input.sessions.reduce((total, session) => total + (session.durationMs || 0), 0);

  return {
    answered: input.attempts.length,
    correct: correctAttempts.length,
    accuracy: correctedAttempts.length
      ? Math.round((correctAttempts.length / correctedAttempts.length) * 100)
      : 0,
    recentAnswered: recentAttempts.length,
    recentCorrect: recentAttempts.filter((attempt) => attempt.isCorrect === true).length,
    averageTimeSeconds: elapsedAttempts.length
      ? Math.round(elapsedMs / elapsedAttempts.length / 1000)
      : 0,
    sessions: input.sessions.length,
    completedSessions: completedSessions.length,
    studyMinutes: Math.round(studyMs / 60000),
  };
}
