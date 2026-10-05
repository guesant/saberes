import { describe, expect, it } from "vitest";
import { getDefaultPreferences } from "./get-default-preferences.function";

describe("getDefaultPreferences", () => {
  it("returns the safe local defaults", () => {
    expect(getDefaultPreferences())
      .toEqual({
        gamification: true,
        recommendations: true,
        reminders: "not-now",
        richContent: true,
      });
  });
});
