import type { StudyGoal, StudyGoalStatus } from "@guesant/saberes-application";

export interface UpdateStudyGoalStatusInput {
  goal: StudyGoal;
  now: string;
  status: StudyGoalStatus;
}
