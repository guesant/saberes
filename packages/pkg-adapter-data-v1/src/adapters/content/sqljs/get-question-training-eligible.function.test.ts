import { expect, it } from "vitest";
import { getQuestionTrainingEligible } from "./get-question-training-eligible.function";

it("blocks provisional occurrences independently from canonical question publication", () => {
  expect(getQuestionTrainingEligible({ editorial_status: "published", occurrence_id: 12, occurrence_status: "review" }))
    .toBe(false);

  expect(getQuestionTrainingEligible({ editorial_status: "published", occurrence_id: 12, occurrence_status: "published" }))
    .toBe(true);
});

it("allows a published independent exercise and preserves old read model compatibility", () => {
  expect(getQuestionTrainingEligible({ editorial_status: "published" }))
    .toBe(true);

  expect(getQuestionTrainingEligible({ editorial_status: "draft" }))
    .toBe(false);

  expect(getQuestionTrainingEligible({}))
    .toBeUndefined();
});
