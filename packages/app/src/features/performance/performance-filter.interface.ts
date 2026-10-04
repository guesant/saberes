import type { PerformancePeriod } from "./performance-period.type";
import type { PerformanceScope } from "./performance-scope.type";

export interface PerformanceFilter {
  period: PerformancePeriod;
  scope: PerformanceScope;
  scopeKey?: string;
}
