import { UIMetricGrid, UIMetricGridItem } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { StudyMetric } from "../my-study/study-metric.component";
import { PerformanceSummaryMasteryMetrics } from "./performance-summary-mastery-metrics.component";
import { PerformanceSummaryPrimaryMetrics } from "./performance-summary-primary-metrics.component";
import type { PerformanceSummary } from "./performance-summary.interface";

export type PerformanceSummaryGridProps = {
  summary: PerformanceSummary;
};

export function PerformanceSummaryGrid(props: PerformanceSummaryGridProps) {
  const { t } = useTranslation();

  return (
    <UIMetricGrid>
      <PerformanceSummaryPrimaryMetrics summary={props.summary} />
      <PerformanceSummaryMasteryMetrics summary={props.summary} />
      <UIMetricGridItem>
        <StudyMetric
          label={t("performance.confidenceWithBand", {
            band: t(`performance.confidenceBands.${props.summary.confidenceBand}`),
            trend: t(`performance.trend.${props.summary.trend}`),
          })}
          value={props.summary.confidencePercent}
        />
      </UIMetricGridItem>
    </UIMetricGrid>
  );
}
