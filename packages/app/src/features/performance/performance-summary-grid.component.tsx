import { UIMetricGrid } from "@guesant/saberes-ui";
import { PerformanceSummaryPrimaryMetrics } from "./performance-summary-primary-metrics.component";
import type { PerformanceSummary } from "./performance-summary.interface";

export type PerformanceSummaryGridProps = {
  summary: PerformanceSummary;
};

export function PerformanceSummaryGrid(props: PerformanceSummaryGridProps) {
  return (
    <UIMetricGrid>
      <PerformanceSummaryPrimaryMetrics summary={props.summary} />
    </UIMetricGrid>
  );
}
