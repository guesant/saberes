import { getPerformanceScopeKey } from "./get-performance-scope-key.function";
import type { GetPerformanceReadyViewFilterInput } from "./get-performance-ready-view-filter-input.interface";
import type { PerformanceFilter } from "./performance-filter.interface";

export function getPerformanceReadyViewFilter(
  input: GetPerformanceReadyViewFilterInput,
): PerformanceFilter {
  return {
    ...input.filter,
    scopeKey: getPerformanceScopeKey(input.filter.scope, input.course, input.plan),
  };
}
