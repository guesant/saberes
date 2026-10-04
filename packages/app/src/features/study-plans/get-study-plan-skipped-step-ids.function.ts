export function getStudyPlanSkippedStepIds(skippedStepIds: unknown): string[] {
  return Array.isArray(skippedStepIds)
    ? skippedStepIds.filter((item): item is string => typeof item === "string")
    : [];
}
