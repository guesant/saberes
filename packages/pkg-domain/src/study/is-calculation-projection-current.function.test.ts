import { describe, expect, it } from "vitest";
import { isCalculationProjectionCurrent } from "./is-calculation-projection-current.function";
import type { CalculationOrigin } from "../models/calculation-origin.model";
import type { CalculationProjectionMetadata } from "../models/calculation-projection-metadata.model";
import type { CalculationRuleVersion } from "../models/calculation-rule-version.model";

const origin: CalculationOrigin = { kind: "academic-discipline", reference: "discipline:1" };

const ruleVersion: CalculationRuleVersion = { identifier: "academic-metrics", version: "1" };

const staleMetadata: CalculationProjectionMetadata = {
  calculatedAt: "2026-10-05T00:00:00.000Z",
  origin,
  ruleVersion,
  status: "stale",
};

const invalidatedMetadata: CalculationProjectionMetadata = {
  ...staleMetadata,
  invalidatedAt: "2026-10-05T01:00:00.000Z",
  status: "invalidated",
};

describe("isCalculationProjectionCurrent", () => {
  it("accepts current metadata for the same origin and rule", () => {
    expect(
      isCalculationProjectionCurrent({
        currentOrigin: origin,
        currentRuleVersion: ruleVersion,
        metadata: {
          calculatedAt: "2026-10-05T00:00:00.000Z",
          origin,
          ruleVersion,
          status: "current",
        },
      }),
    )
      .toBe(true);
  });

  it("rejects stale and invalidated metadata", () => {
    const staleInput = {
      currentOrigin: origin,
      currentRuleVersion: ruleVersion,
      metadata: staleMetadata,
    };

    expect(isCalculationProjectionCurrent(staleInput))
      .toBe(false);

    expect(isCalculationProjectionCurrent({ ...staleInput, metadata: invalidatedMetadata }))
      .toBe(false);
  });
});
