import { DiagnosisCode, type AttemptRecord } from "../index.ts";

export function suggestDiagnosis(
  attempt: Pick<AttemptRecord, "isCorrect" | "elapsedMs" | "attemptNumber">,
): DiagnosisCode {
  if (attempt.isCorrect) {
    if ((attempt.attemptNumber || 1) > 1) {
      return DiagnosisCode.CorrectWithDoubt;
    }

    if (Number(attempt.elapsedMs || 0) < 5000) {
      return DiagnosisCode.CorrectByGuess;
    }

    return DiagnosisCode.CorrectConfident;
  }

  if (Number(attempt.elapsedMs || 0) < 2500) {
    return DiagnosisCode.Inattention;
  }

  return DiagnosisCode.ConceptGap;
}
