import {
  DiagnosisCode,
  type DiagnosisCode as DiagnosisCodeValue,
} from "@guesant/saberes-application";
import type { DiagnosisLabelKey } from "../exercises/diagnosis-label-key.type";

const diagnosisLabelKeys: Record<DiagnosisCodeValue, DiagnosisLabelKey> = {
  [DiagnosisCode.ConceptGap]: "exercise.diagnosis.conceptGap",
  [DiagnosisCode.DidNotKnow]: "exercise.diagnosis.didNotKnow",
  [DiagnosisCode.ProceduralGap]: "exercise.diagnosis.proceduralGap",
  [DiagnosisCode.InterpretationGap]: "exercise.diagnosis.interpretationGap",
  [DiagnosisCode.StrategyGap]: "exercise.diagnosis.strategyGap",
  [DiagnosisCode.Inattention]: "exercise.diagnosis.inattention",
  [DiagnosisCode.Forgetting]: "exercise.diagnosis.forgetting",
  [DiagnosisCode.CorrectWithDoubt]: "exercise.diagnosis.correctWithDoubt",
  [DiagnosisCode.CorrectByGuess]: "exercise.diagnosis.correctByGuess",
  [DiagnosisCode.CorrectConfident]: "exercise.diagnosis.correctConfident",
};

export function getDiagnosisLabelKey(code: DiagnosisCodeValue): DiagnosisLabelKey {
  return diagnosisLabelKeys[code];
}
