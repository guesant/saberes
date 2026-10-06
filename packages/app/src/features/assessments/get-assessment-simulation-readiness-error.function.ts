import { getAssessmentQuestionKeys } from "./get-assessment-question-keys.function";
import { isAssessmentSimulationDurationValid } from "./is-assessment-simulation-duration-valid.function";
import type { StartAssessmentSimulationSessionInput } from "./start-assessment-simulation-session-input.interface";

export function getAssessmentSimulationReadinessError(input: StartAssessmentSimulationSessionInput): string | null {
  const readinessReason = input.assessment.readinessReason ?? "Esta avaliação ainda não está disponível para simulação.";

  if (!input.assessment.canSimulate) {
    return readinessReason;
  }

  const questionKeys = getAssessmentQuestionKeys(input.items);

  const timeLimitMs = input.assessment.duration_minutes * 60_000;

  if (!isAssessmentSimulationDurationValid(questionKeys.length, timeLimitMs)) {
    return readinessReason;
  }

  return null;
}
