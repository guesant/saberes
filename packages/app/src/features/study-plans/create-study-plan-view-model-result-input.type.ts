import type { StudyPlanActions } from "./study-plan-actions.interface";
import type { StudyPlanLocalState } from "./study-plan-local-state.interface";
import type { StudyPlanViewModelState } from "./study-plan.view-model";
import type { StudyPlanReadModel, StudyRecord } from "@guesant/saberes-application";

export type CreateStudyPlanViewModelResultInput = {
  state: StudyPlanViewModelState;
  data: StudyPlanReadModel | null;
  progress: StudyRecord[];
  localState: StudyPlanLocalState;
  steps: Array<Record<string, unknown>>;
  nextStep: Record<string, unknown> | null;
  error: Error | null;
  actions: StudyPlanActions;
};
