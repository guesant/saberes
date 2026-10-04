import type { CreateStudyGoalAction } from "./create-study-goal-action.interface";

export interface GoalFormOptions {
  onCreate: CreateStudyGoalAction;
  existingTitles: string[];
}
