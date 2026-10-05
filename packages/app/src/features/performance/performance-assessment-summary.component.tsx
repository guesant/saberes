import { UICard, UICardContent, UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { PerformanceAssessmentSummaryProps } from "./performance-assessment-summary-props.type";

export function PerformanceAssessmentSummary(props: PerformanceAssessmentSummaryProps) {
  const { t } = useTranslation();

  return (
    <UICard>
      <UICardContent>
        <UIContentGroup variant="content">
          <UITypography variant="h5">{t("performance.assessmentTitle")}</UITypography>
          <UITypography color="text.secondary">
            {t("performance.assessmentSummary", {
              answered: props.summary.answered,
              accuracy: props.summary.accuracy,
              completed: props.summary.completedSessions,
              sessions: props.summary.sessions,
            })}
          </UITypography>
        </UIContentGroup>
      </UICardContent>
    </UICard>
  );
}
