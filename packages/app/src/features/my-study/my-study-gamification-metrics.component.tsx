import { UIMetricGridItem } from "@guesant/saberes-ui";
import { StudyMetric } from "./study-metric.component";
import type { MyStudyMetrics } from "./my-study-metrics.interface";

export interface MyStudyGamificationMetricsProps {
  metrics: MyStudyMetrics;
  streakLabel: string;
  achievementsLabel: string;
}

export function MyStudyGamificationMetrics(props: MyStudyGamificationMetricsProps) {
  return (
    <>
      <UIMetricGridItem>
        <StudyMetric label={props.streakLabel} value={props.metrics.streak} />
      </UIMetricGridItem>
      <UIMetricGridItem>
        <StudyMetric label={props.achievementsLabel} value={props.metrics.achievements} />
      </UIMetricGridItem>
    </>
  );
}
