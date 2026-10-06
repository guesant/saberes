import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { PerformanceAssessmentSummary } from "./performance-assessment-summary.component";
import { PerformanceBackToSummaryAction } from "./performance-back-to-summary-action.component";
import { PerformanceDiagnosisList } from "./performance-diagnosis-list.component";
import { PerformanceFilters } from "./performance-filters.component";
import { PerformanceSummaryDetails } from "./performance-summary-details.component";
import { PerformanceTopicList } from "./performance-topic-list.component";
import type { PerformanceDetailsPageProps } from "./performance-details-page-props.interface";

export function PerformanceDetailsPage(props: PerformanceDetailsPageProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="section">
      <UIContentGroup variant="content">
        <PerformanceBackToSummaryAction />
        <UITypography variant="h2">{t("performance.detailsTitle")}</UITypography>
      </UIContentGroup>
      <PerformanceSummaryDetails summary={props.viewData.summary} />
      <PerformanceFilters
        courseLabel={props.viewData.course?.title}
        filter={props.filter}
        onChangePeriod={props.onChangePeriod}
        onChangeScope={props.onChangeScope}
        planLabel={props.viewData.plan?.title}
      />
      <PerformanceAssessmentSummary summary={props.viewData.assessmentSummary} />
      <PerformanceTopicList stats={props.viewData.topicStats} />
      <PerformanceDiagnosisList
        onDecision={props.onDecision}
        stats={props.viewData.diagnosisStats}
      />
    </UIContentGroup>
  );
}
