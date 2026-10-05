import { describe, expect, it } from "vitest";
import { calculateAcademicFrequency } from "./calculate-academic-frequency.function";

describe("calculateAcademicFrequency", () => {
  it("returns full frequency when there are no classes", () => {
    expect(calculateAcademicFrequency(0, 0))
      .toBe(100);
  });

  it("rounds the percentage to two decimal places", () => {
    expect(calculateAcademicFrequency(3, 2))
      .toBe(66.67);
  });
});
