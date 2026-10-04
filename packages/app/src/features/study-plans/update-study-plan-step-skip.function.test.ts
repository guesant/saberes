import { describe, expect, it } from "vitest";
import { updateStudyPlanStepSkip } from "./update-study-plan-step-skip.function";

describe("updateStudyPlanStepSkip", () => {
  it("adiciona uma etapa à lista de etapas puladas", () => {
    expect(updateStudyPlanStepSkip(["step-1"], "step-2"))
      .toEqual(["step-1", "step-2"]);
  });

  it("remove uma etapa já pulada", () => {
    expect(updateStudyPlanStepSkip(["step-1", "step-2"], "step-1"))
      .toEqual(["step-2"]);
  });
});
