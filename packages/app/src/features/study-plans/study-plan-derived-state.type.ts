import type { StudyPlanLocalState } from "./study-plan-local-state.interface";

export type StudyPlanDerivedState = {
  localState: StudyPlanLocalState;
  orderedSteps: Array<Record<string, unknown>>;
  nextStep: Record<string, unknown> | null;
};
