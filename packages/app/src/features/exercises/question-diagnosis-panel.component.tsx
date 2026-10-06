import { UIButton } from "@guesant/saberes-ui";
import { useTranslation } from "react-i18next";
import { QuestionDiagnosisDialog } from "./question-diagnosis-dialog.component";
import { useQuestionDiagnosisModal } from "./use-question-diagnosis-modal.hook";
import type { QuestionDiagnosisPanelProps } from "./question-diagnosis-panel-props.interface";

export function QuestionDiagnosisPanel(props: QuestionDiagnosisPanelProps) {
  const { t } = useTranslation();

  const state = useQuestionDiagnosisModal(props);

  return (
    <>
      <UIButton onClick={state.openDialog} variant="outlined">
        {state.saved ? t("exercise.editAssessment") : t("exercise.evaluateAttempt")}
      </UIButton>
      <QuestionDiagnosisDialog state={state} />
    </>
  );
}
