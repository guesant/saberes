import { describe, expect, it } from "vitest";
import { getNextRecommendationDecision } from "./get-next-recommendation-decision.function";

describe("getNextRecommendationDecision", () => {
  it("explains a recommendation caused by a recent error", () => {
    const decision = getNextRecommendationDecision({
      incompleteItems: [{ id: "item-1", topicId: "topic-1" }],
      recentErrors: [{ topicIds: ["topic-1"] }],
    });

    expect(decision.reason)
      .toBe("recent-error");
  });

  it("reports when there is no local recommendation", () => {
    const decision = getNextRecommendationDecision();

    expect(decision)
      .toEqual({ item: null, reason: "none" });
  });
});
