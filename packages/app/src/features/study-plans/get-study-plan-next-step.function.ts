export function getStudyPlanNextStep(
  steps: Array<Record<string, unknown>>,
  completed: Set<string>,
): Record<string, unknown> | null {
  return (
    steps.find((step) => {
      return !completed.has(String(step.id));
    }) || null
  );
}
