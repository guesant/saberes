import { saveStudyPlanStateAction } from "./save-study-plan-state-action.function";
import type { CreateStudyPlanLocalStateActionsInput } from "./create-study-plan-local-state-actions-input.type";
import type { StudyPlanLocalStateActions } from "./study-plan-local-state-actions.interface";

export function createStudyPlanLocalStateActions(
  input: CreateStudyPlanLocalStateActionsInput,
): StudyPlanLocalStateActions {
  const updateStudyPlanPause = (): Promise<void> =>
    saveStudyPlanStateAction(input, {
      ...input.state,
      status: input.state.status === "paused" ? "active" : "paused",
    });

  const updateTargetDate = (targetDate: string): Promise<void> =>
    saveStudyPlanStateAction(input, { ...input.state, targetDate });

  const updateStartDate = (startDate: string): Promise<void> =>
    saveStudyPlanStateAction(input, { ...input.state, startDate });

  const updateDailyMinutes = (dailyMinutes: number): Promise<void> =>
    saveStudyPlanStateAction(input, {
      ...input.state,
      dailyMinutes: Math.max(1, Math.min(480, dailyMinutes)),
    });

  return {
    togglePause: updateStudyPlanPause,
    updateStartDate,
    updateTargetDate,
    updateDailyMinutes,
    skipStep: (stepId: string): Promise<void> =>
      saveStudyPlanStateAction(input, {
        ...input.state,
        skippedStepIds: [...new Set([...input.state.skippedStepIds, stepId])],
      }),
  };
}
