import type { StudyPlanStateInput } from "./study-plan-state-input.type";

export type StudyPlanState = "loading" | "error" | "ready";

export function getStudyPlanState(input: StudyPlanStateInput): StudyPlanState {
  if (input.planPending || input.progressPending) {
    return "loading";
  }

  if (input.planError || input.progressError) {
    return "error";
  }

  return "ready";
}
