import { UIButton, UIButtonActionIcon } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { StudyPlanStepSkipActionProps } from "./study-plan-step-skip-action-props.type";

export function StudyPlanStepSkipAction(props: StudyPlanStepSkipActionProps) {
  const { t } = useTranslation();

  return (
    <UIButton
      disabled={props.disabled}
      startIcon={<UIButtonActionIcon name="skipNext" />}
      size="small"
      variant="text"
      onClick={() => {
        return props.onSkip(props.stepId);
      }}
    >
      {props.skipped ? t("plan.unskipStep") : t("plan.skipStep")}
    </UIButton>
  );
}
