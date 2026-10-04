import type { PerformancePeriod } from "./performance-period.type";

export function getPerformancePeriodDays(period: PerformancePeriod): number | null {
  if (period === "7d") {
    return 7;
  }

  if (period === "30d") {
    return 30;
  }

  return null;
}
