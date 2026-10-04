import type { PerformanceConfidenceBand } from "./performance-confidence-band.type";

export interface PerformanceSummary {
  answered: number;
  correct: number;
  accuracy: number;
  recentAnswered: number;
  recentCorrect: number;
  averageTimeSeconds: number;
  sessions: number;
  completedSessions: number;
  studyMinutes: number;
  studiedTopics: number;
  masteredTopics: number;
  confidencePercent: number;
  confidenceBand: PerformanceConfidenceBand;
  trend: "down" | "stable" | "up";
}
