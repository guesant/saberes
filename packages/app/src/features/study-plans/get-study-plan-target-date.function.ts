export function getStudyPlanTargetDate(targetDate: unknown): string {
  return typeof targetDate === "string" ? targetDate : "";
}
