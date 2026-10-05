import { UIContentGroup, UILinearProgress, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { StudyPlanProgressSummaryProps } from "./study-plan-progress-summary-props.type";

export function StudyPlanProgressSummary(props: StudyPlanProgressSummaryProps) {
  const { t } = useTranslation();

  return (
    <UIContentGroup variant="content">
      <UITypography color="text.secondary">
        {props.nextStep
          ? `${t("plan.nextStep")}: ${String(props.nextStep.title)}`
          : t("plan.completed")}
      </UITypography>
      <UITypography variant="body2">
        {t("plan.progress", {
          completed: props.completedSteps,
          percentage: props.percentage,
          total: props.totalSteps,
        })}
      </UITypography>
      <UILinearProgress
        aria-label={t("plan.progressLabel")}
        value={props.percentage}
        variant="determinate"
      />
    </UIContentGroup>
  );
}
