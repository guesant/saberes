import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { getPerformanceAssessmentSummary } from "./get-performance-assessment-summary.function";
import { getPerformanceDiagnosisStats } from "./get-performance-diagnosis-stats.function";
import { getPerformanceSummary } from "./get-performance-summary.function";
import { getPerformanceTopicStats } from "./get-performance-topic-stats.function";
import { PerformanceAssessmentSummary } from "./performance-assessment-summary.component";
import { PerformanceDiagnosisList } from "./performance-diagnosis-list.component";
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
    topicMastery: props.data.topicMastery,
  });

  const topicStats = getPerformanceTopicStats(props.data.attempts);

  const assessmentSummary = getPerformanceAssessmentSummary({
    attempts: props.data.attempts,
    sessions: props.data.sessions,
  });

  const diagnosisStats = getPerformanceDiagnosisStats(props.data.attempts);

  const hasErrors = props.data.attempts.some((attempt) => attempt.isCorrect === false);

  return (
    <UIContentGroup variant="section">
      <UIContentGroup variant="tight">
        <UITypography variant="overline">{t("performance.eyebrow")}</UITypography>
        <UITypography variant="h2">{t("performance.title")}</UITypography>
        <UITypography color="text.secondary">{t("performance.description")}</UITypography>
      </UIContentGroup>
      <PerformanceSummaryGrid summary={summary} />
      <PerformanceAssessmentSummary summary={assessmentSummary} />
      <PerformanceTopicList stats={topicStats} />
      <PerformanceDiagnosisList stats={diagnosisStats} />
      <PerformanceNextAction hasAttempts={props.data.attempts.length > 0} hasErrors={hasErrors} />
    </UIContentGroup>
  );
}
