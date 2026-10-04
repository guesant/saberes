import { describe, expect, it } from "vitest";
import { canResumeStudySession } from "./can-resume-study-session.function";
import type { StudySession } from "@guesant/saberes-application";

describe("canResumeStudySession", () => {
  it("allows an active question session with pending questions", () => {
    const session: StudySession = {
      id: "session-1",
      activityType: "question",
      questionKeys: ["question:one"],
      status: "active",
    };

    expect(canResumeStudySession(session))
      .toBe(true);
  });

  it("rejects completed sessions and sessions without questions", () => {
    const completed: StudySession = {
      id: "session-1",
      activityType: "review",
      questionKeys: ["question:one"],
      status: "completed",
    };

    const empty: StudySession = {
      id: "session-2",
      activityType: "assessment",
      status: "paused",
    };

    expect(canResumeStudySession(completed))
      .toBe(false);

    expect(canResumeStudySession(empty))
      .toBe(false);
  });
});
