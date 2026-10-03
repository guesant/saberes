import { DiagnosisCode, PedagogicalAction } from "../index.ts";

export function actionForDiagnosis(code: DiagnosisCode): PedagogicalAction {
  if (code === DiagnosisCode.ConceptGap || code === DiagnosisCode.DidNotKnow) {
    return PedagogicalAction.Theory;
  }

  if (
    code === DiagnosisCode.ProceduralGap ||
    code === DiagnosisCode.InterpretationGap ||
    code === DiagnosisCode.StrategyGap
  ) {
    return PedagogicalAction.Practice;
  }

  if (
    code === DiagnosisCode.Forgetting ||
    code === DiagnosisCode.CorrectWithDoubt ||
    code === DiagnosisCode.CorrectByGuess
  ) {
    return PedagogicalAction.Review;
  }

  if (code === DiagnosisCode.Inattention) {
    return PedagogicalAction.Retry;
  }

  return PedagogicalAction.None;
}
