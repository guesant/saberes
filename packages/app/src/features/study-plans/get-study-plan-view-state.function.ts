import { getStudyPlanState } from "./get-study-plan-state.function";
import type { StudyPlanState } from "./get-study-plan-state.function";

export interface StudyPlanQueryState {
  isPending: boolean;
  isError: boolean;
}

export function getStudyPlanViewState(
  planQuery: StudyPlanQueryState,
  progressQuery: StudyPlanQueryState,
): StudyPlanState {
  return getStudyPlanState({
    planPending: planQuery.isPending,
    progressPending: progressQuery.isPending,
    planError: planQuery.isError,
    progressError: progressQuery.isError,
  });
}
