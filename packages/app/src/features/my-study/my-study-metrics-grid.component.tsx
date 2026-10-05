import { UIDisclosure, UIMetricGrid, UIMetricGridItem } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { getMyStudyMetrics } from "./get-my-study-metrics.function";
import { MyStudyGamificationMetrics } from "./my-study-gamification-metrics.component";
import { StudyMetric } from "./study-metric.component";
import type { MyStudyReadModel } from "./my-study-read-model.interface";

export type MyStudyMetricsGridProps = {
  data: MyStudyReadModel;
  showGamification: boolean;
};

export function MyStudyMetricsGrid(props: MyStudyMetricsGridProps) {
  const { t } = useTranslation();

  const metrics = getMyStudyMetrics(props.data);

  return (
    <UIDisclosure summary={t("home.progressSummary")}>
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
        {props.showGamification ? (
          <MyStudyGamificationMetrics
            achievementsLabel={t("home.achievements")}
            metrics={metrics}
            streakLabel={t("home.streak")}
          />
        ) : null}
        <UIMetricGridItem>
          <StudyMetric label={t("home.masteredTopics")} value={metrics.masteredTopics} />
        </UIMetricGridItem>
      </UIMetricGrid>
    </UIDisclosure>
  );
}
