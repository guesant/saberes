import { saveStudyPlanLocalState } from "./save-study-plan-local-state.function";
import type { CreateStudyPlanLocalStateActionsInput } from "./create-study-plan-local-state-actions-input.type";
import type { StudyPlanLocalState } from "./study-plan-local-state.interface";

export function saveStudyPlanStateAction(
  input: CreateStudyPlanLocalStateActionsInput,
  state: StudyPlanLocalState,
): Promise<void> {
  return saveStudyPlanLocalState({
    services: input.services,
    queryClient: input.queryClient,
    slug: input.slug,
    state,
  });
}
