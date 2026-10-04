import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { getPerformanceSummary } from "./get-performance-summary.function";
import { getPerformanceTopicStats } from "./get-performance-topic-stats.function";
import { PerformanceNextAction } from "./performance-next-action.component";
import { PerformanceSummaryGrid } from "./performance-summary-grid.component";
import { PerformanceTopicList } from "./performance-topic-list.component";
import type { MyStudyReadModel } from "../my-study/my-study-read-model.interface";

export type PerformanceReadyViewProps = {
  data: MyStudyReadModel;
};

export function PerformanceReadyView(props: PerformanceReadyViewProps) {
  const { t } = useTranslation();

  const summary = getPerformanceSummary({
    attempts: props.data.attempts,
    now: new Date(),
    sessions: props.data.sessions,
  });

  const topicStats = getPerformanceTopicStats(props.data.attempts);

  const hasErrors = props.data.attempts.some((attempt) => attempt.isCorrect === false);

  return (
    <UIContentGroup variant="section">
      <UIContentGroup variant="tight">
        <UITypography variant="overline">{t("performance.eyebrow")}</UITypography>
        <UITypography variant="h2">{t("performance.title")}</UITypography>
        <UITypography color="text.secondary">{t("performance.description")}</UITypography>
      </UIContentGroup>
      <PerformanceSummaryGrid summary={summary} />
      <PerformanceTopicList stats={topicStats} />
      <PerformanceNextAction hasAttempts={props.data.attempts.length > 0} hasErrors={hasErrors} />
    </UIContentGroup>
  );
}
