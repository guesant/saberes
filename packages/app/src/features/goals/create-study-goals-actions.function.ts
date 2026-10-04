import { createStudyGoalCreateAction } from "./create-study-goal-create-action.function";
import { createStudyGoalProgressAction } from "./create-study-goal-progress-action.function";
import { createStudyGoalStatusActions } from "./create-study-goal-status-actions.function";
import type { StudyGoalsActionDependencies } from "./study-goals-action-dependencies.interface";
import type { UseStudyGoalsViewModel } from "./study-goals.view-model";

export function createStudyGoalsActions(
  input: StudyGoalsActionDependencies,
): Pick<
  UseStudyGoalsViewModel,
  "archive" | "complete" | "create" | "pause" | "restore" | "resume" | "updateProgress"
> {
  return {
    ...createStudyGoalStatusActions(input),
    create: createStudyGoalCreateAction(input),
    updateProgress: createStudyGoalProgressAction(input),
  };
}
