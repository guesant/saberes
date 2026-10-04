import type { UpdateStudyGoalStatusInput } from "./update-study-goal-status-input.interface";
import type { StudyGoal } from "@guesant/saberes-application";

export function updateStudyGoalStatus(input: UpdateStudyGoalStatusInput): StudyGoal {
  return { ...input.goal, status: input.status, updatedAt: input.now };
}
