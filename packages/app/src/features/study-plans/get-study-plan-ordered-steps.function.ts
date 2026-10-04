import type { StudyPlanLocalState } from "./study-plan-local-state.interface";

export function getStudyPlanOrderedSteps(
  steps: Array<Record<string, unknown>>,
  state: StudyPlanLocalState,
): Array<Record<string, unknown>> {
  const byId = new Map(
    steps.map((step) => {
      return [String(step.id), step];
    }),
  );

  const ordered = state.orderedStepIds.flatMap((id) => {
    const step = byId.get(id);

    return step ? [step] : [];
  });

  const remaining = steps.filter((step) => {
    return !state.orderedStepIds.includes(String(step.id));
  });

  return [...ordered, ...remaining];
}
