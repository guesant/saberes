import { FocusSessionStatus } from "@guesant/saberes-application";
import { describe, expect, it } from "vitest";
import { createFocusSession } from "./create-focus-session.function";

describe("createFocusSession", () => {
  it("preserves an optional content key in the local session", () => {
    expect(createFocusSession("focus:1", "2026-10-04T12:00:00.000Z", "lesson:algebra-1"))
      .toEqual({
        contentReference: { type: "lesson", id: "algebra-1" },
        elapsedMs: 0,
        id: "focus:1",
        startedAt: "2026-10-04T12:00:00.000Z",
        status: FocusSessionStatus.Active,
      });
  });
});
