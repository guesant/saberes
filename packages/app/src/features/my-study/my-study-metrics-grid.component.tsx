import { UIMetricGrid, UIMetricGridItem } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { getMyStudyMetrics } from "./get-my-study-metrics.function";
import { StudyMetric } from "./study-metric.component";
import type { MyStudyReadModel } from "./my-study-read-model.interface";

export type MyStudyMetricsGridProps = {
  data: MyStudyReadModel;
};

export function MyStudyMetricsGrid(props: MyStudyMetricsGridProps) {
  const { t } = useTranslation();

  const metrics = getMyStudyMetrics(props.data);

  return (
    <UIMetricGrid>
      <UIMetricGridItem>
        <StudyMetric label={t("home.answeredQuestions")} value={metrics.answered} />
      </UIMetricGridItem>
      <UIMetricGridItem>
        <StudyMetric label={t("home.correctAnswers")} value={metrics.correct} />
      </UIMetricGridItem>
      <UIMetricGridItem>
        <StudyMetric label={t("course.reviews")} value={metrics.reviews} />
      </UIMetricGridItem>
      <UIMetricGridItem>
        <StudyMetric label={t("home.streak")} value={metrics.streak} />
      </UIMetricGridItem>
      <UIMetricGridItem>
        <StudyMetric label={t("home.achievements")} value={metrics.achievements} />
      </UIMetricGridItem>
      <UIMetricGridItem>
        <StudyMetric label={t("home.masteredTopics")} value={metrics.masteredTopics} />
      </UIMetricGridItem>
    </UIMetricGrid>
  );
}
