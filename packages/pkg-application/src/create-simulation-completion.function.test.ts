import { describe, expect, it, vi } from "vitest";
import { createSimulationCompletion } from "./create-simulation-completion.function";
import type { QuestionReadModel, StudySession } from "./models/index";

const questionKey = "question:occurrence-1";

const question: QuestionReadModel = {
  question: {
    canonical_key: "question:canonical-1",
    occurrence_key: questionKey,
    occurrence_id: 1,
    question_id: 1,
    correct_answer: "A",
    is_automatically_gradable: true,
    type: "single_choice",
  },
  options: [],
  parts: [],
  topics: [],
  subjectIds: [2],
  skills: [{ id: 8, slug: "modelagem", name: "Modelagem", relationType: "primary" }],
  related: [],
};

const session: StudySession = {
  id: "simulation-1",
  mode: "simulation",
  questionKeys: [questionKey],
  questionWeights: [{ questionKey, maxPoints: 2 }],
  targetEditionKey: "unicamp-2027",
  targetStageKey: "first-phase",
  questionContexts: { [questionKey]: { questionContentVersion: "2.1.0", answerKeyVersion: "4", sourceEditionKey: "unicamp-2024", sourceStageKey: "first-phase" } },
  simulationAnswers: [{ questionKey, value: "A", answeredAt: "2026-10-05T10:00:00.000Z", hintIdsUsed: [3] }],
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
        canonicalQuestionId: 1,
        targetEditionKey: "unicamp-2027",
        targetStageKey: "first-phase",
        sourceEditionKey: "unicamp-2024",
        sourceStageKey: "first-phase",
        questionContentVersion: "2.1.0",
        answerKeyVersion: "4",
        subjectIds: [2],
        skillIds: [8],
        hintIdsUsed: [3],
        assisted: true,
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

  it("awards an annulled item only with the session rule and never records an answer attempt", async () => {
    const cancelledQuestion: QuestionReadModel = {
      ...question,
      question: {
        ...question.question,
        answer_status: "cancelled",
        correct_answer: undefined,
        is_automatically_gradable: false,
      },
    };
    const sessionWithDraft = {
      ...session,
      simulationAnswers: [{ questionKey, value: "A", answeredAt: "2026-10-05T10:00:00.000Z" }],
      cancelledQuestionPolicy: "award_max_points" as const,
    };

    const awarded = await createSimulationCompletion({
      session: sessionWithDraft,
      questionKeys: [questionKey],
      getQuestion: { execute: async () => { return cancelledQuestion; } },
      completedAt: "2026-10-05T10:10:00.000Z",
    });

    expect(awarded.results).toEqual([{
      questionKey,
      answer: "",
      expectedAnswer: "",
      isCorrect: null,
      answerStatus: "cancelled",
      maxPoints: 2,
      earnedPoints: 2,
    }]);
    expect(awarded.attempts).toEqual([]);

    const notAwarded = await createSimulationCompletion({
      session: { ...sessionWithDraft, cancelledQuestionPolicy: undefined },
      questionKeys: [questionKey],
      getQuestion: { execute: async () => { return cancelledQuestion; } },
      completedAt: "2026-10-05T10:10:00.000Z",
    });

    expect(notAwarded.results[0]?.earnedPoints).toBeNull();
    expect(notAwarded.attempts).toEqual([]);
  });
});
