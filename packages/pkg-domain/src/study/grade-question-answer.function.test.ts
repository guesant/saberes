import { describe, expect, it } from "vitest";
import { gradeQuestionAnswer } from "./grade-question-answer.function";

describe("gradeQuestionAnswer", () => {
  it("corrige alternativa única sem diferenciar maiúsculas", () => {
    expect(
      gradeQuestionAnswer({
        answer: "c",
        automaticallyGradable: true,
        expectedAnswer: "C",
        questionType: "single_choice",
      }),
    )
      .toBe(true);
  });

  it("corrige múltiplas alternativas em qualquer ordem", () => {
    expect(
      gradeQuestionAnswer({
        answer: "B, A",
        automaticallyGradable: true,
        expectedAnswer: "A;B",
        questionType: "multiple_choice",
      }),
    )
      .toBe(true);
  });

  it("corrige números com separador decimal local", () => {
    expect(
      gradeQuestionAnswer({
        answer: "3,14",
        automaticallyGradable: true,
        expectedAnswer: "3.14",
        questionType: "numeric",
      }),
    )
      .toBe(true);
  });

  it("normaliza verdadeiro e falso", () => {
    expect(
      gradeQuestionAnswer({
        answer: "V",
        automaticallyGradable: true,
        expectedAnswer: "true",
        questionType: "true_false",
      }),
    )
      .toBe(true);
  });

  it("mantém questões não automáticas pendentes", () => {
    expect(
      gradeQuestionAnswer({
        answer: "qualquer resposta",
        automaticallyGradable: false,
        expectedAnswer: "",
        questionType: "essay",
      }),
    )
      .toBeNull();
  });
});
