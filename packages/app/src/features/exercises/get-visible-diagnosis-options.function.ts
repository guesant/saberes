import { DiagnosisCode } from "@guesant/saberes-application";
import { diagnosisOptions } from "./diagnosis-options.config";
import type { DiagnosisOption } from "./diagnosis-option.type";

const correctCodes = new Set([
  DiagnosisCode.CorrectWithDoubt,
  DiagnosisCode.CorrectByGuess,
  DiagnosisCode.CorrectConfident,
]);

export function getVisibleDiagnosisOptions(result: boolean | null): DiagnosisOption[] {
  if (result === null) {
    return diagnosisOptions;
  }

  return diagnosisOptions.filter((option) => {
    return correctCodes.has(option.code) === result;
  });
}
