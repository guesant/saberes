import { updateStudyGoalProgress } from "./update-study-goal-progress.function";
import type { CreateStudyGoalProgressAction } from "./create-study-goal-progress-action.interface";
import type { StudyGoalsActionDependencies } from "./study-goals-action-dependencies.interface";

export function createStudyGoalProgressAction(
  input: StudyGoalsActionDependencies,
): CreateStudyGoalProgressAction {
  return async (contentKey: string, current: number): Promise<void> => {
    const goal = input.goals.find((item) => item.contentKey === contentKey);

    if (goal) {
      await input.save(updateStudyGoalProgress({ goal, current, now: new Date().toISOString() }));
    }
  };
}
