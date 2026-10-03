export function createCompletedStepSet(progress: Array<Record<string, unknown>>) {
  return new Set(progress.filter((item) => item.completed).map((item) => String(item.stepId)));
}
