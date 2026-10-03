export function getStudyPlanError(
  firstError: Error | null,
  secondError: Error | null,
): Error | null {
  return firstError ?? secondError ?? null;
}
