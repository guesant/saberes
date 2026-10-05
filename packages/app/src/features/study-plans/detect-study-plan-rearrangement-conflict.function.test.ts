import { describe, expect, it } from "vitest";
import { calculateStudyPlanRearrangementConflict } from "./calculate-study-plan-rearrangement-conflict.function";

describe("calculateStudyPlanRearrangementConflict", () => {
  it("accepts a reordered permutation", () => {
    expect(
      calculateStudyPlanRearrangementConflict({
        baselineOrder: ["one", "two", "three"],
        candidateOrder: ["two", "one", "three"],
      }),
    )
      .toEqual({
        duplicatedStepIds: [],
        hasConflict: false,
        missingStepIds: [],
        unexpectedStepIds: [],
      });
  });

  it("reports missing, unexpected and duplicated steps", () => {
    expect(
      calculateStudyPlanRearrangementConflict({
        baselineOrder: ["one", "two"],
        candidateOrder: ["one", "one", "other"],
      }),
    )
      .toEqual({
        duplicatedStepIds: ["one"],
        hasConflict: true,
        missingStepIds: ["two"],
        unexpectedStepIds: ["other"],
      });
  });
});
