import type { GetPerformanceAssessmentSummaryInput } from "./get-performance-assessment-summary-input.interface";
import type { PerformanceAssessmentSummary } from "./performance-assessment-summary.interface";

export function getPerformanceAssessmentSummary(
  input: GetPerformanceAssessmentSummaryInput,
): PerformanceAssessmentSummary {
  const assessmentSessions = input.sessions.filter((session) => {
    return session.activityType === "assessment";
  });

  const assessmentSessionIds = new Set(
    assessmentSessions.map((session) => {
      return session.id;
    }),
  );

  const attempts = input.attempts.filter((attempt) => {
    return attempt.sessionId && assessmentSessionIds.has(attempt.sessionId);
  });

  const correctedAttempts = attempts.filter((attempt) => {
    return attempt.isCorrect !== null;
  });

  const correctAttempts = correctedAttempts.filter((attempt) => {
    return attempt.isCorrect === true;
  });

  return {
    sessions: assessmentSessions.length,
    completedSessions: assessmentSessions.filter((session) => {
      return session.status === "completed";
    }).length,
    answered: attempts.length,
    correct: correctAttempts.length,
    accuracy: correctedAttempts.length
      ? Math.round((correctAttempts.length / correctedAttempts.length) * 100)
      : 0,
  };
}
