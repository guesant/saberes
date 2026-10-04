export function getStudyPlanOrderedStepIds(orderedStepIds: unknown): string[] {
  return Array.isArray(orderedStepIds)
    ? orderedStepIds.filter((item): item is string => typeof item === "string")
    : [];
}
