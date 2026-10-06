import { describe, expect, it, vi } from "vitest";
import { createSimulationCompletion } from "./create-simulation-completion.function";
import type { QuestionReadModel, StudySession } from "./models/index";

const questionKey = "question:occurrence-1";

const question: QuestionReadModel = {
  question: {
    canonical_key: "question:canonical-1",
    occurrence_key: questionKey,
    occurrence_id: 1,
    correct_answer: "A",
    is_automatically_gradable: true,
    type: "single_choice",
  },
  options: [],
  parts: [],
  topics: [],
  related: [],
};

const session: StudySession = {
  id: "simulation-1",
  mode: "simulation",
  questionKeys: [questionKey],
  simulationAnswers: [{ questionKey, value: "A", answeredAt: "2026-10-05T10:00:00.000Z" }],
  questionWeights: [{ questionKey, maxPoints: 2 }],
};

describe("createSimulationCompletion", () => {
  it("scores answers and creates attempts linked to the session and occurrence", async () => {
    const execute = vi.fn(async () => { return question; });

    const result = await createSimulationCompletion({
      session,
      questionKeys: [questionKey],
      getQuestion: { execute },
      completedAt: "2026-10-05T10:10:00.000Z",
    });

    expect(result.results)
      .toEqual([{
        questionKey,
        answer: "A",
        expectedAnswer: "A",
        isCorrect: true,
        maxPoints: 2,
        earnedPoints: 2,
      }]);

    expect(result.attempts)
      .toEqual([expect.objectContaining({
        id: "simulation-1:simulation:question:occurrence-1",
        contentKey: questionKey,
        questionId: "1",
        sessionId: "simulation-1",
        source: "simulation",
        isCorrect: true,
      })]);

    expect(execute)
      .toHaveBeenCalledWith(questionKey);
  });

  it("fails completion when an assessment question is unavailable", async () => {
    await expect(createSimulationCompletion({
      session,
      questionKeys: [questionKey],
      getQuestion: { execute: async () => { return null; } },
      completedAt: "2026-10-05T10:10:00.000Z",
    })).rejects.toThrow("Uma questão do simulado está indisponível.");
  });
});
