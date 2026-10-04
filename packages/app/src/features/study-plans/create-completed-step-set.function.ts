export function createCompletedStepSet(progress: Array<Record<string, unknown>>) {
  return new Set(
    progress
      .filter((item) => {
        return item.completed;
      })
      .map((item) => {
        return String(item.stepId);
      }),
  );
}
