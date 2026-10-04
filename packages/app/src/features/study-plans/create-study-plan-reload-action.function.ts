import { reloadStudyPlanData } from "./reload-study-plan-data.function";
import type { CreateStudyPlanReloadActionInput } from "./create-study-plan-reload-action-input.type";
import type { AsyncAction } from "../../types/async-action.type";

export function createStudyPlanReloadAction(
  input: CreateStudyPlanReloadActionInput,
): AsyncAction<[], void> {
  return (): Promise<void> => {
    return reloadStudyPlanData(input);
  };
}
