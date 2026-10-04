import { describe, expect, it } from "vitest";
import { getPerformanceSummary } from "./get-performance-summary.function";
import type { GetPerformanceSummaryInput } from "./get-performance-summary-input.interface";

const summaryInput: GetPerformanceSummaryInput = {
  attempts: [
    {
      answeredAt: "2026-10-04T10:00:00.000Z",
      elapsedMs: 10000,
      isCorrect: true,
    },
    {
      answeredAt: "2026-10-01T10:00:00.000Z",
      elapsedMs: 20000,
      isCorrect: false,
    },
    {
      answeredAt: "2026-09-20T10:00:00.000Z",
      isCorrect: true,
    },
  ],
  now: new Date("2026-10-04T12:00:00.000Z"),
  sessions: [
    { durationMs: 120000, id: "session-1", status: "completed" },
    { durationMs: 60000, id: "session-2", status: "paused" },
  ],
  topicMastery: [
    { key: "topic:1", learningState: "mastered" },
    { key: "topic:2", learningState: "practicing" },
  ],
};

const filteredSummaryInput: GetPerformanceSummaryInput = {
  ...summaryInput,
  attempts: [
    ...summaryInput.attempts,
    {
      answeredAt: "2026-10-03T10:00:00.000Z",
      contentKey: "question:old",
      isCorrect: false,
      sessionId: "course-session",
    },
  ],
  filter: { period: "30d", scope: "course", scopeKey: "course:sample" },
  sessions: [
    ...summaryInput.sessions,
    {
      contentKey: "course:sample",
      id: "course-session",
      startedAt: "2026-10-03T10:00:00.000Z",
      status: "completed",
    },
  ],
};

describe("getPerformanceSummary", () => {
  it("combina desempenho recente, tempo e sessões", () => {
    const result = getPerformanceSummary(summaryInput);

    expect(result)
      .toEqual({
        accuracy: 67,
        answered: 3,
        averageTimeSeconds: 15,
        completedSessions: 1,
        correct: 2,
        recentAnswered: 2,
        recentCorrect: 1,
        sessions: 2,
        studyMinutes: 3,
        studiedTopics: 2,
        masteredTopics: 1,
        confidencePercent: 60,
        confidenceBand: "medium",
        trend: "up",
      });
  });

  it("filtra o resumo por período e escopo local", () => {
    const result = getPerformanceSummary(filteredSummaryInput);

    expect(result.answered)
      .toBe(1);

    expect(result.sessions)
      .toBe(1);
  });
});
