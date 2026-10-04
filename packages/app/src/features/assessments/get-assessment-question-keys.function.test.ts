import { describe, expect, it } from "vitest";
import { getAssessmentQuestionKeys } from "./get-assessment-question-keys.function";

describe("getAssessmentQuestionKeys", () => {
  it("converte itens publicados em chaves estáveis de questão", () => {
    expect(
      getAssessmentQuestionKeys([
        { question_occurrence_id: 10 },
        { question_id: "11" },
        { title: "sem questão" },
      ]),
    )
      .toEqual(["question:10", "question:11"]);
  });
});
