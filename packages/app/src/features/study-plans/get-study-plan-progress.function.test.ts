import { describe, expect, it } from "vitest";
import { getStudyPlanProgress } from "./get-study-plan-progress.function";

describe("getStudyPlanProgress", () => {
  it("calcula o progresso das etapas", () => {
    expect(
      getStudyPlanProgress({
        steps: [{ id: 1 }, { id: 2 }, { id: 3 }],
        completed: new Set(["1"]),
      }),
    )
      .toEqual({ completedSteps: 1, percentage: 33, totalSteps: 3 });
  });

  it("retorna zero para plano sem etapas", () => {
    expect(getStudyPlanProgress({ steps: [], completed: new Set() }))
      .toEqual({
        completedSteps: 0,
        percentage: 0,
        totalSteps: 0,
      });
  });
});
