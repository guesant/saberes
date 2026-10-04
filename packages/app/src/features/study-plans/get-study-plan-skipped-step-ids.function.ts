export function getStudyPlanSkippedStepIds(skippedStepIds: unknown): string[] {
  return Array.isArray(skippedStepIds)
    ? skippedStepIds.filter((item): item is string => {
      return typeof item === "string";
    })
    : [];
}
