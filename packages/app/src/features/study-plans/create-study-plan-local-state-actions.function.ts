import { saveStudyPlanStateAction } from "./save-study-plan-state-action.function";
import { updateStudyPlanStepSkip } from "./update-study-plan-step-skip.function";
import type { CreateStudyPlanLocalStateActionsInput } from "./create-study-plan-local-state-actions-input.type";
import type { StudyPlanLocalStateActions } from "./study-plan-local-state-actions.interface";

export function createStudyPlanLocalStateActions(
  input: CreateStudyPlanLocalStateActionsInput,
): StudyPlanLocalStateActions {
  const updateStudyPlanPause = (): Promise<void> => {
    return saveStudyPlanStateAction(input, {
      ...input.state,
      status: input.state.status === "paused" ? "active" : "paused",
    });
  };

  const updateTargetDate = (targetDate: string): Promise<void> => {
    return saveStudyPlanStateAction(input, { ...input.state, targetDate });
  };

  const updateStartDate = (startDate: string): Promise<void> => {
    return saveStudyPlanStateAction(input, { ...input.state, startDate });
  };

  const updateDailyMinutes = (dailyMinutes: number): Promise<void> => {
    return saveStudyPlanStateAction(input, {
      ...input.state,
      dailyMinutes: Math.max(1, Math.min(480, dailyMinutes)),
    });
  };

  return {
    togglePause: updateStudyPlanPause,
    updateStartDate,
    updateTargetDate,
    updateDailyMinutes,
    skipStep: (stepId: string): Promise<void> => {
      return saveStudyPlanStateAction(input, {
        ...input.state,
        skippedStepIds: updateStudyPlanStepSkip(input.state.skippedStepIds, stepId),
      });
    },
  };
}
