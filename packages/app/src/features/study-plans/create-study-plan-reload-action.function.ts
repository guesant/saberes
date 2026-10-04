import { reloadStudyPlanData } from "./reload-study-plan-data.function";
import type { CreateStudyPlanReloadActionInput } from "./create-study-plan-reload-action-input.type";

export function createStudyPlanReloadAction(
  input: CreateStudyPlanReloadActionInput,
): () => Promise<void> {
  return (): Promise<void> => reloadStudyPlanData(input);
}
