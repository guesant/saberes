import { calculateMovedStudyPlanStepOrder } from "./calculate-moved-study-plan-step-order.function";
import { getStudyPlanStepOrder } from "./get-study-plan-step-order.function";
import { saveStudyPlanLocalState } from "./save-study-plan-local-state.function";
import type { CreateStudyPlanActionsInput } from "./create-study-plan-actions-input.type";
import type { AsyncAction } from "../../types/async-action.type";

export function createStudyPlanMoveStepAction(
  input: CreateStudyPlanActionsInput,
): AsyncAction<[string, -1 | 1], void> {
  return (stepId: string, direction: -1 | 1): Promise<void> => {
    return saveStudyPlanLocalState({
      services: input.services,
      queryClient: input.queryClient,
      slug: input.slug,
      state: {
        ...input.state,
        orderedStepIds: calculateMovedStudyPlanStepOrder(
          getStudyPlanStepOrder(input.steps, input.state),
          stepId,
          direction,
        ),
      },
    });
  };
}
