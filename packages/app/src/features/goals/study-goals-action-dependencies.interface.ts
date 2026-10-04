import { StudyGoalStatus, type StudyGoal } from "@guesant/saberes-application";

export interface StudyGoalsActionDependencies {
  goals: StudyGoal[];
  id(): string;

  save(goal: StudyGoal): Promise<void>;
  status: typeof StudyGoalStatus;
}
