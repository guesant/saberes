import { UIContentGroup, UIDialog, UITypography } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { DiagnosisOption } from "./diagnosis-option.component";
import { QuestionDiagnosisActions } from "./question-diagnosis-actions.component";
import { QuestionDiagnosisError } from "./question-diagnosis-error.component";
import type { QuestionDiagnosisModalState } from "./question-diagnosis-modal-state.interface";

export interface QuestionDiagnosisDialogProps {
  state: QuestionDiagnosisModalState;
}

export function QuestionDiagnosisDialog(props: QuestionDiagnosisDialogProps) {
  const { t } = useTranslation();

  return (
    <UIDialog onClose={props.state.closeDialog} open={props.state.open} title={t("exercise.diagnosisLabel")}>
      <UIContentGroup variant="content">
        <UITypography color="text.secondary">{t("exercise.diagnosisHint")}</UITypography>
        {props.state.options.map((option) => {
          return <DiagnosisOption key={option.code} onSelect={props.state.selectCode} option={option} selected={props.state.selectedCode === option.code} />;
        })}
        {props.state.error ? <QuestionDiagnosisError /> : null}
        <QuestionDiagnosisActions state={props.state} />
      </UIContentGroup>
    </UIDialog>
  );
}
