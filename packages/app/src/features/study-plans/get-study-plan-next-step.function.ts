export function getStudyPlanNextStep(
  steps: Array<Record<string, unknown>>,
  completed: Set<string>,
): Record<string, unknown> | null {
  return steps.find((step) => !completed.has(String(step.id))) || null;
}
