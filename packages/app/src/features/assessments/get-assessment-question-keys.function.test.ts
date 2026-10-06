import { describe, expect, it } from "vitest";
import { getAssessmentQuestionKeys } from "./get-assessment-question-keys.function";

describe("getAssessmentQuestionKeys", () => {
  it("converte itens publicados em chaves estáveis de questão", () => {
    expect(
      getAssessmentQuestionKeys([
        { question_occurrence_id: 10 },
        { questionKey: "exercise:autoral-11", question_id: 11 },
        { title: "sem questão" },
      ]),
    )
      .toEqual(["question:10", "exercise:autoral-11"]);
  });

  it("preserva chaves canônicas e não confunde o id da questão com uma ocorrência", () => {
    expect(getAssessmentQuestionKeys([
      { questionKey: "exercise:conceito", question_occurrence_id: 99 },
      { question_slug: "autoral", question_id: 42 },
      { question_id: 42 },
      { questionKey: "exercise:conceito" },
    ]))
      .toEqual(["exercise:conceito", "exercise:autoral"]);
  });
});
