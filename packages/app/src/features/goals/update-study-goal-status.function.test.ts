import { StudyGoalMetric, StudyGoalStatus, type StudyGoal } from "@guesant/saberes-application";
import { describe, expect, it } from "vitest";
import { updateStudyGoalStatus } from "./update-study-goal-status.function";

const goal: StudyGoal = {
  contentKey: "goal:1",
  createdAt: "2026-01-01T10:00:00.000Z",
  current: 5,
  metric: StudyGoalMetric.Minutes,
  status: StudyGoalStatus.Active,
  target: 30,
  title: "Estudar",
  updatedAt: "2026-01-01T10:00:00.000Z",
};

describe("updateStudyGoalStatus", () => {
  it("changes only the status and update timestamp", () => {
    const result = updateStudyGoalStatus({
      goal,
      now: "2026-01-01T11:00:00.000Z",
      status: StudyGoalStatus.Paused,
    });

    expect(result)
      .toEqual({
        ...goal,
        status: StudyGoalStatus.Paused,
        updatedAt: "2026-01-01T11:00:00.000Z",
      });
  });
});
