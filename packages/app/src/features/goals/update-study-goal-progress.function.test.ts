import { StudyGoalMetric, StudyGoalStatus, type StudyGoal } from "@guesant/saberes-application";
import { describe, expect, it } from "vitest";
import { updateStudyGoalProgress } from "./update-study-goal-progress.function";

const goal: StudyGoal = {
  contentKey: "goal:one",
  title: "Estudar",
  metric: StudyGoalMetric.Minutes,
  target: 30,
  current: 10,
  status: StudyGoalStatus.Active,
  createdAt: "2026-10-04T00:00:00.000Z",
  updatedAt: "2026-10-04T00:00:00.000Z",
};

describe("updateStudyGoalProgress", () => {
  it("keeps progress inside the goal range", () => {
    expect(
      updateStudyGoalProgress({ goal, current: 50, now: "2026-10-04T01:00:00.000Z" }),
    )
      .toMatchObject({ current: 30, updatedAt: "2026-10-04T01:00:00.000Z" });
  });
});
