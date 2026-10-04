export function updateStudyPlanStepSkip(skippedStepIds: string[], stepId: string): string[] {
  const nextSkippedStepIds = new Set(skippedStepIds);

  if (nextSkippedStepIds.has(stepId)) {
    nextSkippedStepIds.delete(stepId);
  } else {
    nextSkippedStepIds.add(stepId);
  }

  return [...nextSkippedStepIds];
}
