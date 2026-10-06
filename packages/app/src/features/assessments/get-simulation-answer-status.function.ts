import type { TFunction } from "i18next";

export function getSimulationAnswerStatus(isCorrect: boolean | null, translate: TFunction): string {
  if (isCorrect === null) {
    return String(translate("simulator.discursive"));
  }

  if (isCorrect) {
    return String(translate("simulator.corrected"));
  }

  return String(translate("simulator.incorrect"));
}
