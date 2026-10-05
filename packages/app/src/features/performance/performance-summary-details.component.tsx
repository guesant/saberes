import { UIMetricGrid, UIMetricGridItem } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { StudyMetric } from "../my-study/study-metric.component";
import { PerformanceSummaryMasteryMetrics } from "./performance-summary-mastery-metrics.component";
import type { PerformanceSummaryDetailsProps } from "./performance-summary-details-props.interface";

export function PerformanceSummaryDetails(props: PerformanceSummaryDetailsProps) {
  const { t } = useTranslation();

  return (
    <UIMetricGrid>
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
