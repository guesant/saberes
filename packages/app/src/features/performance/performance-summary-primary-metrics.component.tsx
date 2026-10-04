import { UIMetricGridItem } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { StudyMetric } from "../my-study/study-metric.component";
import type { PerformanceSummary } from "./performance-summary.interface";

export interface PerformanceSummaryPrimaryMetricsProps {
  summary: PerformanceSummary;
}

export function PerformanceSummaryPrimaryMetrics(props: PerformanceSummaryPrimaryMetricsProps) {
  const { t } = useTranslation();

  return (
    <>
      <UIMetricGridItem>
        <StudyMetric label={t("performance.attempts")} value={props.summary.answered} />
      </UIMetricGridItem>
      <UIMetricGridItem>
        <StudyMetric label={t("performance.correctedUtilization")} value={props.summary.accuracy} />
      </UIMetricGridItem>
      <UIMetricGridItem>
        <StudyMetric label={t("performance.recentAttempts")} value={props.summary.recentAnswered} />
      </UIMetricGridItem>
      <UIMetricGridItem>
        <StudyMetric label={t("performance.studyMinutes")} value={props.summary.studyMinutes} />
      </UIMetricGridItem>
      <UIMetricGridItem>
        <StudyMetric
          label={t("performance.averageTimeSeconds")}
          value={props.summary.averageTimeSeconds}
        />
      </UIMetricGridItem>
      <UIMetricGridItem>
        <StudyMetric
          label={t("performance.completedSessions")}
          value={props.summary.completedSessions}
        />
      </UIMetricGridItem>
    </>
  );
}
