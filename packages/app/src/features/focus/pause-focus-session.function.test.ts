import { FocusSessionStatus, type FocusSession } from "@guesant/saberes-application";
import { describe, expect, it } from "vitest";
import { pauseFocusSession } from "./pause-focus-session.function";

const session: FocusSession = {
  elapsedMs: 0,
  id: "focus-1",
  startedAt: "2026-01-01T10:00:00.000Z",
  status: FocusSessionStatus.Active,
};

describe("pauseFocusSession", () => {
  it("persists the elapsed time and paused state", () => {
    const result = pauseFocusSession(session, new Date("2026-01-01T10:25:00.000Z"));

    expect(result.status).toBe(FocusSessionStatus.Paused);

    expect(result.elapsedMs).toBe(25 * 60 * 1000);

    expect(result.pausedAt).toBe("2026-01-01T10:25:00.000Z");
  });
});
