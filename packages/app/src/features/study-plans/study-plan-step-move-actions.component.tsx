import { UIButton, UIInlineActions } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { StudyPlanStepMoveActionsProps } from "./study-plan-step-move-actions-props.type";

export function StudyPlanStepMoveActions(props: StudyPlanStepMoveActionsProps) {
  const { t } = useTranslation();

  return (
    <UIInlineActions>
      <UIButton
        size="small"
        variant="text"
        aria-label={t("plan.moveStepUp")}
        onClick={() => props.onMove(props.stepId, -1)}
      >
        ↑
      </UIButton>
      <UIButton
        size="small"
        variant="text"
        aria-label={t("plan.moveStepDown")}
        onClick={() => props.onMove(props.stepId, 1)}
      >
        ↓
      </UIButton>
    </UIInlineActions>
  );
}
