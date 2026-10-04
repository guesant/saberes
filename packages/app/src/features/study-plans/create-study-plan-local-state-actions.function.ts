import { saveStudyPlanLocalState } from "./save-study-plan-local-state.function";
import type { CreateStudyPlanLocalStateActionsInput } from "./create-study-plan-local-state-actions-input.type";
import type { StudyPlanLocalStateActions } from "./study-plan-local-state-actions.interface";

export function createStudyPlanLocalStateActions(
  input: CreateStudyPlanLocalStateActionsInput,
): StudyPlanLocalStateActions {
  const saveStudyPlanState = (
    state: CreateStudyPlanLocalStateActionsInput["state"],
  ): Promise<void> =>
    saveStudyPlanLocalState({
      services: input.services,
      queryClient: input.queryClient,
      slug: input.slug,
      state,
    });

  const updateStudyPlanPause = (): Promise<void> =>
    saveStudyPlanState({
      ...input.state,
      status: input.state.status === "paused" ? "active" : "paused",
    });

  const updateTargetDate = (targetDate: string): Promise<void> =>
    saveStudyPlanState({ ...input.state, targetDate });

  const updateDailyMinutes = (dailyMinutes: number): Promise<void> =>
    saveStudyPlanState({
      ...input.state,
      dailyMinutes: Math.max(1, Math.min(480, dailyMinutes)),
    });

  return { togglePause: updateStudyPlanPause, updateTargetDate, updateDailyMinutes };
}
