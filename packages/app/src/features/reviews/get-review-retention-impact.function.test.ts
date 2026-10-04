import { describe, expect, it } from "vitest";
import { getReviewRetentionImpact } from "./get-review-retention-impact.function";

describe("getReviewRetentionImpact", () => {
  it("estima a carga ativa para a meta configurada", () => {
    const impact = getReviewRetentionImpact({
      load: { due: 2, upcoming: 3, suspended: 1, total: 6 },
      retention: 0.99,
    });

    expect(impact).toEqual({ retentionPercent: 99, estimatedReviews: 6 });
  });
});
