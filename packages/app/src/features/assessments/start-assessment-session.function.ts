import { getAssessmentQuestionKeys } from "./get-assessment-question-keys.function";
import { startAssessmentSimulationSession } from "./start-assessment-simulation-session.function";
import { startAssessmentStudySession } from "./start-assessment-study-session.function";
import type { StartAssessmentSessionInput } from "./start-assessment-session-input.interface";

export async function startAssessmentSession(input: StartAssessmentSessionInput): Promise<void> {
  if (input.assessment.canPractice === false) {
    throw new Error("Este caderno está liberado para consulta, mas não para treino.");
  }

  if (input.mode === "simulation") {
    await startAssessmentSimulationSession(input);

    return;
  }

  await startAssessmentStudySession({
    assessmentKey: input.assessmentKey,
    navigate: input.navigate,
    questionKeys: input.questionKeys.length ? input.questionKeys : getAssessmentQuestionKeys(input.items),
    services: input.services,
  });
}
