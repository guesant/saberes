import { StudyGoalStatus } from "@guesant/saberes-application";
import type { CreateStudyGoalAction } from "./create-study-goal-action.interface";
import type { StudyGoalsActionDependencies } from "./study-goals-action-dependencies.interface";
import type { StudyGoal } from "@guesant/saberes-application";

export function createStudyGoalCreateAction(
  input: StudyGoalsActionDependencies,
): CreateStudyGoalAction {
  return async (goalInput): Promise<void> => {
    const now = new Date().toISOString();

    const goal: StudyGoal = {
      contentKey: `goal:${input.id()}`,
      title: goalInput.title,
      metric: goalInput.metric,
      target: goalInput.target,
      current: 0,
      status: StudyGoalStatus.Active,
      createdAt: now,
      updatedAt: now,
      dueAt: goalInput.dueAt || undefined,
    };

    await input.save(goal);
  };
}
