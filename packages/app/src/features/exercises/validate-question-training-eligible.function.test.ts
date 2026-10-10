import { expect, it } from "vitest";
import { validateQuestionTrainingEligible } from "./validate-question-training-eligible.function";
import type { QuestionReadModel } from "@guesant/saberes-application";

it("rejects a provisional occurrence before recording an attempt", () => {
  const data = { question: { training_eligible: false } } as QuestionReadModel;

  expect(() => {return validateQuestionTrainingEligible(data);})
    .toThrow("somente para consulta");
});

it("accepts approved content and retains legacy read model compatibility", () => {
  expect(() => {return validateQuestionTrainingEligible({ question: { training_eligible: true } } as QuestionReadModel);}).not.toThrow();

  expect(() => {return validateQuestionTrainingEligible({ question: {} } as QuestionReadModel);}).not.toThrow();
});
