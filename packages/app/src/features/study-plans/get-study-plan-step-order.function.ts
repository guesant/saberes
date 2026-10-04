import type { StudyPlanLocalState } from "./study-plan-local-state.interface";

export function getStudyPlanStepOrder(
  steps: Array<Record<string, unknown>>,
  state: StudyPlanLocalState,
): string[] {
  return state.orderedStepIds.length ? state.orderedStepIds : steps.map((step) => String(step.id));
}
