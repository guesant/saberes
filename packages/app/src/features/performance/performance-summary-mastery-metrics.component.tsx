import { UIMetricGridItem } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { StudyMetric } from "../my-study/study-metric.component";
import type { PerformanceSummaryMasteryMetricsProps } from "./performance-summary-mastery-metrics-props.type";

export function PerformanceSummaryMasteryMetrics(props: PerformanceSummaryMasteryMetricsProps) {
  const { t } = useTranslation();

  return (
    <>
      <UIMetricGridItem>
        <StudyMetric label={t("performance.studiedTopics")} value={props.summary.studiedTopics} />
      </UIMetricGridItem>
      <UIMetricGridItem>
        <StudyMetric label={t("performance.masteredTopics")} value={props.summary.masteredTopics} />
      </UIMetricGridItem>
    </>
  );
}
