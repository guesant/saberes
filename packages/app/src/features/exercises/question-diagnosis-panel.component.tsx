import {
  DiagnosisCode,
  type DiagnosisCode as DiagnosisCodeValue,
} from "@guesant/saberes-application";
import { UIContentGroup, UITypography } from "@guesant/saberes-ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DiagnosisOption } from "./diagnosis-option.component";
import { QuestionDiagnosisSaved } from "./question-diagnosis-saved.component";
import type { DiagnosisOption as DiagnosisOptionValue } from "./diagnosis-option.type";

export type QuestionDiagnosisPanelProps = { onDiagnose(code: DiagnosisCodeValue): Promise<void> };

const diagnosisOptions: DiagnosisOptionValue[] = [
  { code: DiagnosisCode.ConceptGap, labelKey: "exercise.diagnosis.conceptGap" },
  { code: DiagnosisCode.DidNotKnow, labelKey: "exercise.diagnosis.didNotKnow" },
  { code: DiagnosisCode.ProceduralGap, labelKey: "exercise.diagnosis.proceduralGap" },
  { code: DiagnosisCode.InterpretationGap, labelKey: "exercise.diagnosis.interpretationGap" },
  { code: DiagnosisCode.StrategyGap, labelKey: "exercise.diagnosis.strategyGap" },
  { code: DiagnosisCode.Inattention, labelKey: "exercise.diagnosis.inattention" },
  { code: DiagnosisCode.Forgetting, labelKey: "exercise.diagnosis.forgetting" },
  { code: DiagnosisCode.CorrectWithDoubt, labelKey: "exercise.diagnosis.correctWithDoubt" },
  { code: DiagnosisCode.CorrectByGuess, labelKey: "exercise.diagnosis.correctByGuess" },
  { code: DiagnosisCode.CorrectConfident, labelKey: "exercise.diagnosis.correctConfident" },
];

export function QuestionDiagnosisPanel(props: QuestionDiagnosisPanelProps) {
  const { onDiagnose } = props;

  const { t } = useTranslation();

  const [diagnosisSaved, setDiagnosisSaved] = useState(false);

  const handleDiagnosis = async (code: DiagnosisCodeValue) => {
    await onDiagnose(code);

    setDiagnosisSaved(true);
  };

  return (
    <UIContentGroup variant="tight">
      <UITypography variant="h6">{t("exercise.diagnosisLabel")}</UITypography>
      <UITypography>{t("exercise.diagnosisHint")}</UITypography>
      {diagnosisOptions.map((option) => {
        return <DiagnosisOption key={option.code} option={option} onSelect={handleDiagnosis} />;
      })}
      {diagnosisSaved ? <QuestionDiagnosisSaved /> : null}
    </UIContentGroup>
  );
}
