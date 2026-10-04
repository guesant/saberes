import { StudyGoalMetric, StudyGoalStatus, type StudyGoal } from "@guesant/saberes-application";
import { describe, expect, it } from "vitest";
import { getStudyGoalTiming } from "./get-study-goal-timing.function";

const goal: StudyGoal = {
  contentKey: "goal:timing",
  createdAt: "2026-01-01T10:00:00.000Z",
  current: 1,
  dueAt: "2026-01-10T10:00:00.000Z",
  metric: StudyGoalMetric.Lessons,
  status: StudyGoalStatus.Active,
  target: 3,
  title: "Estudar",
  updatedAt: "2026-01-01T10:00:00.000Z",
};

describe("getStudyGoalTiming", () => {
  it("identifies an active goal that is on track", () => {
    expect(getStudyGoalTiming(goal, new Date("2026-01-05T10:00:00.000Z"))).toBe("on_track");
  });

  it("identifies an active goal that is overdue", () => {
    expect(getStudyGoalTiming(goal, new Date("2026-01-11T10:00:00.000Z"))).toBe("overdue");
  });

  it("identifies completed and undated goals", () => {
    expect(
      getStudyGoalTiming(
        { ...goal, status: StudyGoalStatus.Completed },
        new Date("2026-01-11T10:00:00.000Z"),
      ),
    ).toBe("completed");

    expect(getStudyGoalTiming({ ...goal, dueAt: undefined }, new Date())).toBe("no_deadline");
  });
});
