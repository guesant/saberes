import { describe, expect, it } from "vitest";
import { updateQuestionStudySession } from "./update-question-study-session.function";
import type { StudySession } from "@guesant/saberes-application";

const activeSession: StudySession = {
  id: "session-1",
  questionKeys: ["question:1", "question:2"],
  currentIndex: 0,
  answeredQuestionKeys: [],
  correctAnswers: 0,
  status: "active",
};

const almostCompletedSession: StudySession = {
  ...activeSession,
  currentIndex: 1,
  answeredQuestionKeys: ["question:1"],
  correctAnswers: 1,
};

describe("updateQuestionStudySession", () => {
  it("avança a sessão e registra o acerto", () => {
    const session = updateQuestionStudySession({
      completedAt: "2026-10-04T12:00:00.000Z",
      correct: true,
      questionKey: "question:1",
      session: activeSession,
    });

    expect(session.currentIndex).toBe(1);

    expect(session.answeredQuestionKeys).toEqual(["question:1"]);

    expect(session.correctAnswers).toBe(1);

    expect(session.status).toBe("active");
  });

  it("conclui a sessão quando a última questão é respondida", () => {
    const session = updateQuestionStudySession({
      completedAt: "2026-10-04T12:00:00.000Z",
      correct: false,
      questionKey: "question:2",
      session: almostCompletedSession,
    });

    expect(session.currentIndex).toBe(2);

    expect(session.status).toBe("completed");

    expect(session.completedAt).toBe("2026-10-04T12:00:00.000Z");
  });

  it("avança sem criar acerto quando a questão é pulada", () => {
    const session = updateQuestionStudySession({
      completedAt: "2026-10-04T12:00:00.000Z",
      correct: null,
      questionKey: "question:1",
      session: activeSession,
      skipped: true,
    });

    expect(session.currentIndex).toBe(1);

    expect(session.answeredQuestionKeys).toEqual(["question:1"]);

    expect(session.skippedQuestionKeys).toEqual(["question:1"]);

    expect(session.correctAnswers).toBe(0);
  });
});
