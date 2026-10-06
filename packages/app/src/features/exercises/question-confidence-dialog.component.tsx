import { UIContentGroup, UIDialog } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { QuestionConfidenceActions } from "./question-confidence-actions.component";
import { QuestionConfidenceInput } from "./question-confidence-input.component";
import type { QuestionConfidenceDialogProps } from "./question-confidence-dialog-props.interface";

export function QuestionConfidenceDialog(props: QuestionConfidenceDialogProps) {
  const { t } = useTranslation();

  return (
    <UIDialog onClose={props.onClose} open={props.open} title={t("exercise.confirmAnswer")}>
      <UIContentGroup variant="content">
        <QuestionConfidenceInput onChange={props.onChange} value={props.confidence} />
        <QuestionConfidenceActions dialog={props} />
      </UIContentGroup>
    </UIDialog>
  );
}
