import { StudyGoalStatus, type StudyGoal } from "@guesant/saberes-application";
import { differenceInCalendarDays } from "date-fns";
import type { StudyGoalTiming } from "./study-goal-timing.type";

export function getStudyGoalTiming(goal: StudyGoal, now: Date): StudyGoalTiming {
  if (goal.status === StudyGoalStatus.Completed) {
    return "completed";
  }

  if (!goal.dueAt) {
    return "no_deadline";
  }

  return differenceInCalendarDays(new Date(goal.dueAt), now) < 0 ? "overdue" : "on_track";
}
