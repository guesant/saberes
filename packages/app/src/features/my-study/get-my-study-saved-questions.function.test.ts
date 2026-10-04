import { CatalogCardType } from "@guesant/saberes-application";
import { describe, expect, it } from "vitest";
import { getMyStudySavedQuestions } from "./get-my-study-saved-questions.function";

describe("getMyStudySavedQuestions", () => {
  it("seleciona questões salvas por ContentKey", () => {
    const questions = getMyStudySavedQuestions({
      bookmarks: [{ contentKey: "question:42" }],
      content: [
        { id: 42, title: "Questão 42", type: CatalogCardType.Question },
        { id: 43, title: "Questão 43", type: CatalogCardType.Question },
      ],
    });

    expect(questions[0]?.id)
      .toBe(42);
  });
});
