import { UIChip } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { StudyPlanStepStatusProps } from "./study-plan-step-status-props.type";

export function StudyPlanStepStatus(props: StudyPlanStepStatusProps) {
  const { t } = useTranslation();

  let label = t("plan.nextStep");

  if (props.completed) {
    label = t("plan.completed");
  }

  if (props.skipped) {
    label = t("plan.skipped");
  }

  return <UIChip size="small" label={label} />;
}
