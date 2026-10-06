import { DiagnosisCode } from "@guesant/saberes-application";
import type { DiagnosisOption } from "./diagnosis-option.type";

export const diagnosisOptions: DiagnosisOption[] = [
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
