import { FocusSessionStatus, type FocusSession } from "@guesant/saberes-application";
import { describe, expect, it } from "vitest";
import { createCompletedFocusSession } from "./create-completed-focus-session.function";

describe("createCompletedFocusSession", () => {
  it("records the completion timestamp and elapsed time", () => {
    const session: FocusSession = {
      id: "focus:1",
      startedAt: "2026-10-04T12:00:00.000Z",
      elapsedMs: 0,
      status: FocusSessionStatus.Active,
    };

    expect(createCompletedFocusSession(session, new Date("2026-10-04T12:30:00.000Z"))).toEqual({
      id: "focus:1",
      startedAt: "2026-10-04T12:00:00.000Z",
      elapsedMs: 1800000,
      endedAt: "2026-10-04T12:30:00.000Z",
      status: FocusSessionStatus.Completed,
    });
  });
});
