import { FocusSessionStatus, type FocusSession } from "@guesant/saberes-application";
import { describe, expect, it } from "vitest";
import { resumeFocusSession } from "./resume-focus-session.function";

const session: FocusSession = {
  elapsedMs: 25 * 60 * 1000,
  id: "focus-1",
  pausedAt: "2026-01-01T10:25:00.000Z",
  startedAt: "2026-01-01T10:00:00.000Z",
  status: FocusSessionStatus.Paused,
};

describe("resumeFocusSession", () => {
  it("keeps elapsed time while returning to active state", () => {
    const result = resumeFocusSession(session, new Date("2026-01-01T11:00:00.000Z"));

    expect(result.status).toBe(FocusSessionStatus.Active);

    expect(result.elapsedMs).toBe(session.elapsedMs);

    expect(result.startedAt).toBe("2026-01-01T10:35:00.000Z");

    expect(result.pausedAt).toBeUndefined();
  });
});
