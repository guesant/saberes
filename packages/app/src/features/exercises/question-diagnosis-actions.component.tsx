import { UIButton, UIInlineActions } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import type { QuestionDiagnosisModalState } from "./question-diagnosis-modal-state.interface";

export interface QuestionDiagnosisActionsProps {
  state: QuestionDiagnosisModalState;
}

export function QuestionDiagnosisActions(props: QuestionDiagnosisActionsProps) {
  const { t } = useTranslation();

  return (
    <UIInlineActions wrap>
      <UIButton disabled={!props.state.selectedCode || props.state.saving} onClick={props.state.saveDiagnosis} variant="contained">
        {props.state.saving ? t("common.saving") : t("exercise.saveDiagnosis")}
      </UIButton>
      <UIButton disabled={props.state.saving} onClick={props.state.closeDialog} variant="outlined">
        {t("backup.cancel")}
      </UIButton>
    </UIInlineActions>
  );
}
