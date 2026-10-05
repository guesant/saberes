import { describe, expect, it } from "vitest";
import { undoStudyPlanRearrangement } from "./undo-study-plan-rearrangement.function";

describe("undoStudyPlanRearrangement", () => {
  it("returns an independent copy of the previous order", () => {
    const previousOrder = ["one", "two"];

    const result = undoStudyPlanRearrangement({ previousOrder });

    expect(result)
      .toEqual(previousOrder);

    expect(result).not.toBe(previousOrder);
  });
});
