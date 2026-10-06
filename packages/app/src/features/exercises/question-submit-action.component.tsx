import { UIFormAction } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { QuestionSubmitActionProps } from "./question-submit-action-props.interface";

export function QuestionSubmitAction(props: QuestionSubmitActionProps) {
  const { t } = useTranslation();

  let label = t("exercise.respond");

  if (props.submitting) {
    label = t("common.saving");
  }

  return (
    <UIFormAction
      variant="contained"
      disabled={!props.answer?.trim() || props.submitting}
      onClick={props.onSubmit}
    >
      {label}
    </UIFormAction>
  );
}
