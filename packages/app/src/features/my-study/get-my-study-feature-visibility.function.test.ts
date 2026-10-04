import { describe, expect, it } from "vitest";
import { getMyStudyFeatureVisibility } from "./get-my-study-feature-visibility.function";

describe("getMyStudyFeatureVisibility", () => {
  it("keeps optional capabilities independent from the study flow", () => {
    expect(
      getMyStudyFeatureVisibility({
        gamification: false,
        recommendations: false,
        reminders: false,
        richContent: false,
      }),
    ).toEqual({
      showGamification: false,
      showRecommendations: false,
      showReminders: false,
      showRichContent: false,
    });
  });
});
