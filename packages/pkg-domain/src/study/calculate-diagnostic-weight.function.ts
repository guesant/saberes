import { DiagnosisCode } from "../index.ts";

export function calculateDiagnosticWeight(code?: DiagnosisCode) {
  if (code === DiagnosisCode.ConceptGap || code === DiagnosisCode.DidNotKnow) {
    return 0.25;
  }

  if (code === DiagnosisCode.Forgetting) {
    return 0.45;
  }

  if (
    code === DiagnosisCode.ProceduralGap ||
    code === DiagnosisCode.InterpretationGap ||
    code === DiagnosisCode.StrategyGap
  ) {
    return 0.55;
  }

  if (code === DiagnosisCode.Inattention) {
    return 0.8;
  }

  if (code === DiagnosisCode.CorrectWithDoubt || code === DiagnosisCode.CorrectByGuess) {
    return 0.7;
  }

  return 1;
}
