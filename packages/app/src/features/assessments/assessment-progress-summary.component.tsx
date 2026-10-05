import { UIContentGroup, UILinearProgress, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { AssessmentProgressSummaryProps } from "./assessment-progress-summary-props.type";

export function AssessmentProgressSummary(props: AssessmentProgressSummaryProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="content">
      <UITypography variant="body2">
        {t("assessment.progress", {
          answered: props.progress.answeredItems,
          correct: props.progress.correctItems,
          total: props.progress.totalItems,
        })}
      </UITypography>
      <UILinearProgress
        aria-label={t("assessment.progressLabel")}
        value={props.progress.percentage}
        variant="determinate"
      />
    </UIContentGroup>
  );
}
