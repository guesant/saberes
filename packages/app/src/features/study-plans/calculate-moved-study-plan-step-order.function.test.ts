import { describe, expect, it } from "vitest";
import { calculateMovedStudyPlanStepOrder } from "./calculate-moved-study-plan-step-order.function";

describe("calculateMovedStudyPlanStepOrder", () => {
  it("move uma etapa para cima", () => {
    expect(calculateMovedStudyPlanStepOrder(["one", "two", "three"], "two", -1)).toEqual([
      "two",
      "one",
      "three",
    ]);
  });

  it("move uma etapa para baixo", () => {
    expect(calculateMovedStudyPlanStepOrder(["one", "two", "three"], "two", 1)).toEqual([
      "one",
      "three",
      "two",
    ]);
  });

  it("preserva a ordem quando o movimento excede os limites", () => {
    const order = ["one", "two"];

    expect(calculateMovedStudyPlanStepOrder(order, "one", -1)).toBe(order);

    expect(calculateMovedStudyPlanStepOrder(order, "two", 1)).toBe(order);

    expect(calculateMovedStudyPlanStepOrder(order, "missing", 1)).toBe(order);
  });
});
