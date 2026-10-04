import { getStudyPlanLocalState } from "./get-study-plan-local-state.function";
import { getStudyPlanNextStep } from "./get-study-plan-next-step.function";
import { getStudyPlanOrderedSteps } from "./get-study-plan-ordered-steps.function";
import type { GetStudyPlanDerivedStateInput } from "./get-study-plan-derived-state-input.type";
import type { StudyPlanDerivedState } from "./study-plan-derived-state.type";

export function getStudyPlanDerivedState(
  input: GetStudyPlanDerivedStateInput,
): StudyPlanDerivedState {
  const localState = getStudyPlanLocalState(input.progress, input.slug);

  const orderedSteps = getStudyPlanOrderedSteps(input.steps, localState);

  const completed = new Set(
    input.progress.filter((item) => item.completed === true).map((item) => String(item.stepId)),
  );

  return {
    localState,
    orderedSteps,
    nextStep: getStudyPlanNextStep(orderedSteps, completed),
  };
}
