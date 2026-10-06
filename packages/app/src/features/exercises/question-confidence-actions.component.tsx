import { UIButton } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { QuestionConfidenceDialogProps } from "./question-confidence-dialog-props.interface";

export interface QuestionConfidenceActionsProps {
  dialog: QuestionConfidenceDialogProps;
}

export function QuestionConfidenceActions(props: QuestionConfidenceActionsProps) {
  const { t } = useTranslation();

  return (
    <UIButton
      disabled={!props.dialog.confidence || props.dialog.submitting}
      iconOnly={false}
      onClick={props.dialog.onConfirm}
      variant="contained"
    >
      {props.dialog.submitting ? t("common.saving") : t("exercise.sendAnswer")}
    </UIButton>
  );
}
