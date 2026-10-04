import { StudyGoalStatus, type StudyGoal } from "@guesant/saberes-application";
import type { UpdateStudyGoalProgressInput } from "./update-study-goal-progress-input.interface";

export function updateStudyGoalProgress(input: UpdateStudyGoalProgressInput): StudyGoal {
  const current = Math.min(Math.max(input.current, 0), input.goal.target);

  return {
    ...input.goal,
    current,
    status: current >= input.goal.target ? StudyGoalStatus.Completed : input.goal.status,
    updatedAt: input.now,
  };
}
