export function getStudyPlanDailyMinutes(dailyMinutes: unknown): number {
  return typeof dailyMinutes === "number" ? dailyMinutes : 30;
}
