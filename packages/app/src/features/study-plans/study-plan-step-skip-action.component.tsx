import { UIButton } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { StudyPlanStepSkipActionProps } from "./study-plan-step-skip-action-props.type";

export function StudyPlanStepSkipAction(props: StudyPlanStepSkipActionProps) {
  const { t } = useTranslation();

  return (
    <UIButton
      disabled={props.disabled}
      size="small"
      variant="text"
      onClick={() => props.onSkip(props.stepId)}
    >
      {t("plan.skipStep")}
    </UIButton>
  );
}
