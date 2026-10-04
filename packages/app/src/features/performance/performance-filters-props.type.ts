import type { PerformanceFilter } from "./performance-filter.interface";
import type { PerformancePeriod } from "./performance-period.type";
import type { PerformanceScope } from "./performance-scope.type";

export type PerformanceFiltersProps = {
  filter: PerformanceFilter;
  courseLabel?: string;
  planLabel?: string;
  onChangePeriod(period: PerformancePeriod): void;

  onChangeScope(scope: PerformanceScope): void;
};
