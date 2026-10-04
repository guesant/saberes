import { getPerformanceAttemptMetrics } from "./get-performance-attempt-metrics.function";
import { getPerformanceConfidenceBand } from "./get-performance-confidence-band.function";
import { getPerformanceFilteredData } from "./get-performance-filtered-data.function";
import { getPerformanceMasteredTopicCount } from "./get-performance-mastered-topic-count.function";
import { getPerformanceSessionMetrics } from "./get-performance-session-metrics.function";
import { getPerformanceTrend } from "./get-performance-trend.function";
import type { GetPerformanceSummaryInput } from "./get-performance-summary-input.interface";
import type { PerformanceSummary } from "./performance-summary.interface";

export function getPerformanceSummary(input: GetPerformanceSummaryInput): PerformanceSummary {
  const filteredData = input.filter
    ? getPerformanceFilteredData({
      attempts: input.attempts,
      filter: input.filter,
      now: input.now,
      sessions: input.sessions,
    })
    : { attempts: input.attempts, sessions: input.sessions };

  const attempts = getPerformanceAttemptMetrics({
    attempts: filteredData.attempts,
    now: input.now,
  });

  const sessions = getPerformanceSessionMetrics({ sessions: filteredData.sessions });

  return {
    answered: filteredData.attempts.length,
    correct: attempts.correctAttempts.length,
    accuracy: attempts.correctedAttempts.length
      ? Math.round((attempts.correctAttempts.length / attempts.correctedAttempts.length) * 100)
      : 0,
    recentAnswered: attempts.recentAttempts.length,
    recentCorrect: attempts.recentAttempts.filter((attempt) => { return attempt.isCorrect === true; }).length,
    averageTimeSeconds: attempts.elapsedAttempts.length
      ? Math.round(attempts.elapsedMs / attempts.elapsedAttempts.length / 1000)
      : 0,
    sessions: filteredData.sessions.length,
    completedSessions: sessions.completedSessions.length,
    studyMinutes: Math.round(sessions.studyMs / 60000),
    studiedTopics: input.topicMastery.length,
    masteredTopics: getPerformanceMasteredTopicCount(input.topicMastery),
    confidencePercent: Math.min(100, attempts.correctedAttempts.length * 20),
    confidenceBand: getPerformanceConfidenceBand(attempts.correctedAttempts.length),
    trend: getPerformanceTrend(attempts.recentAttempts, input.now),
  };
}
