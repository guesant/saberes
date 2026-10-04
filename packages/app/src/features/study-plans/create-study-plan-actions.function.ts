import { createStudyPlanLocalStateActions } from "./create-study-plan-local-state-actions.function";
import { createStudyPlanReloadAction } from "./create-study-plan-reload-action.function";
import { createStudyPlanStepUpdater } from "./create-study-plan-step-updater.function";
import type { CreateStudyPlanActionsInput } from "./create-study-plan-actions-input.type";
import type { StudyPlanActions } from "./study-plan-actions.interface";

export function createStudyPlanActions(input: CreateStudyPlanActionsInput): StudyPlanActions {
  const stepUpdater = createStudyPlanStepUpdater({
    services: input.services,
    queryClient: input.queryClient,
    data: input.data,
  });

  const localStateActions = createStudyPlanLocalStateActions({
    services: input.services,
    queryClient: input.queryClient,
    slug: input.slug,
    state: input.state,
  });

  const reload = createStudyPlanReloadAction({
    reloadPlan: input.reloadPlan,
    reloadProgress: input.reloadProgress,
  });

  return {
    toggleStep: stepUpdater,
    togglePause: localStateActions.togglePause,
    updateTargetDate: localStateActions.updateTargetDate,
    updateDailyMinutes: localStateActions.updateDailyMinutes,
    reload,
  };
}
