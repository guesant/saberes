import { describe, expect, it } from "vitest";
import { getAssessmentProgress } from "./get-assessment-progress.function";

describe("getAssessmentProgress", () => {
  it("calcula progresso por questão distinta do conjunto", () => {
    const result = getAssessmentProgress({
      attempts: [
        { isCorrect: true, questionId: 10 },
        { isCorrect: false, questionId: 10 },
        { isCorrect: true, questionId: 11 },
      ],
      items: [
        { position: 1, question_occurrence_id: 10 },
        { position: 2, question_occurrence_id: 11 },
        { position: 3, question_occurrence_id: 12 },
      ],
    });

    expect(result)
      .toEqual({
        answeredItems: 2,
        correctItems: 1,
        percentage: 67,
        totalItems: 3,
      });
  });

  it("ignora tentativas de questões que não pertencem ao conjunto", () => {
    const result = getAssessmentProgress({
      attempts: [{ isCorrect: true, questionId: 99 }],
      items: [{ position: 1, question_occurrence_id: 10 }],
    });

    expect(result.answeredItems)
      .toBe(0);

    expect(result.totalItems)
      .toBe(1);
  });
});
