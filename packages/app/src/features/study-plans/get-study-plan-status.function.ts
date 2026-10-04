import type { StudyPlanLocalState } from "./study-plan-local-state.interface";

export function getStudyPlanStatus(status: unknown): StudyPlanLocalState["status"] {
  return status === "paused" || status === "completed" ? status : "active";
}
