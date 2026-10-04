import { describe, expect, it } from "vitest";
import { getPerformanceAssessmentSummary } from "./get-performance-assessment-summary.function";

describe("getPerformanceAssessmentSummary", () => {
  it("separa tentativas avaliativas das demais atividades", () => {
    expect(
      getPerformanceAssessmentSummary({
        attempts: [
          { isCorrect: true, sessionId: "assessment-1" },
          { isCorrect: false, sessionId: "assessment-1" },
          { isCorrect: true, sessionId: "practice-1" },
        ],
        sessions: [
          { id: "assessment-1", activityType: "assessment", status: "completed" },
          { id: "practice-1", activityType: "question", status: "completed" },
        ],
      }),
    )
      .toEqual({
        answered: 2,
        accuracy: 50,
        completedSessions: 1,
        correct: 1,
        sessions: 1,
      });
  });
});
