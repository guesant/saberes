import type { StudyGoal } from "@guesant/saberes-application";

export interface UpdateStudyGoalProgressInput {
  goal: StudyGoal;
  current: number;
  now: string;
}
