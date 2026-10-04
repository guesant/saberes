import type { CreateStudyGoalInput } from "./create-study-goal-input.interface";

export interface CreateStudyGoalAction {
  (input: CreateStudyGoalInput): Promise<void>;
}
