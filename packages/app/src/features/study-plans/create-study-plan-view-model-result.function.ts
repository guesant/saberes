import type { CreateStudyPlanViewModelResultInput } from "./create-study-plan-view-model-result-input.type";
import type { StudyPlanViewModel } from "./study-plan.view-model";

export function createStudyPlanViewModelResult(
  input: CreateStudyPlanViewModelResultInput,
): StudyPlanViewModel {
  return {
    state: input.state,
    data: input.data,
    progress: input.progress,
    localState: input.localState,
    steps: input.steps,
    nextStep: input.nextStep,
    error: input.error,
    reload: input.actions.reload,
    toggleStep: input.actions.toggleStep,
    togglePause: input.actions.togglePause,
    updateStartDate: input.actions.updateStartDate,
    updateTargetDate: input.actions.updateTargetDate,
    updateDailyMinutes: input.actions.updateDailyMinutes,
    skipStep: input.actions.skipStep,
    moveStep: input.actions.moveStep,
  };
}
