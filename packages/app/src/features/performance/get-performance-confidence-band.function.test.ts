import { describe, expect, it } from "vitest";
import { getPerformanceConfidenceBand } from "./get-performance-confidence-band.function";

describe("getPerformanceConfidenceBand", () => {
  it("classifica evidência com poucas respostas como baixa", () => {
    expect(getPerformanceConfidenceBand(0))
      .toBe("low");

    expect(getPerformanceConfidenceBand(2))
      .toBe("low");
  });

  it("classifica evidência intermediária como média", () => {
    expect(getPerformanceConfidenceBand(3))
      .toBe("medium");

    expect(getPerformanceConfidenceBand(7))
      .toBe("medium");
  });

  it("classifica evidência suficiente como alta", () => {
    expect(getPerformanceConfidenceBand(8))
      .toBe("high");
  });
});
