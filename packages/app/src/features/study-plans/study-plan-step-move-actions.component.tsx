import { UIButtonActionIcon, UIIconButton, UIInlineActions } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { StudyPlanStepMoveActionsProps } from "./study-plan-step-move-actions-props.type";

export function StudyPlanStepMoveActions(props: StudyPlanStepMoveActionsProps) {
  const { t } = useTranslation();

  return (
    <UIInlineActions>
      <UIIconButton
        aria-label={t("plan.moveStepUp")}
        onClick={() => {
          return props.onMove(props.stepId, -1);
        }}
      >
        <UIButtonActionIcon name="arrowUp" />
      </UIIconButton>
      <UIIconButton
        aria-label={t("plan.moveStepDown")}
        onClick={() => {
          return props.onMove(props.stepId, 1);
        }}
      >
        <UIButtonActionIcon name="arrowDown" />
      </UIIconButton>
    </UIInlineActions>
  );
}
