import { CatalogCardType } from "@guesant/saberes-application";
import { describe, expect, it } from "vitest";
import { getPrioritizedQuestionSessionQuestions } from "./get-prioritized-question-session-questions.function";

describe("prioritizeQuestionSessionQuestions", () => {
  it("prioriza questões não respondidas, depois erros recentes e por fim acertos", () => {
    const result = getPrioritizedQuestionSessionQuestions({
      attempts: [
        { answeredAt: "2026-10-01T00:00:00.000Z", isCorrect: true, questionId: 1 },
        { answeredAt: "2026-10-03T00:00:00.000Z", isCorrect: false, questionId: 2 },
      ],
      questions: [
        { id: 1, title: "Acerto", type: CatalogCardType.Question },
        { id: 2, title: "Erro", type: CatalogCardType.Question },
        { id: 3, title: "Novo", type: CatalogCardType.Question },
      ],
    });

    expect(result[0].id).toBe(3);

    expect(result[1].id).toBe(2);

    expect(result[2].id).toBe(1);
  });
});
