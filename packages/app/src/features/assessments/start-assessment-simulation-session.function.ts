import { createQuestionStudySession } from "../exercises/create-question-study-session.function";
import { createAssessmentQuestionWeights } from "./create-assessment-question-weights.function";
import { getAssessmentQuestionKeys } from "./get-assessment-question-keys.function";
import { getAssessmentSimulationReadinessError } from "./get-assessment-simulation-readiness-error.function";
import type { StartAssessmentSimulationSessionInput } from "./start-assessment-simulation-session-input.interface";
import type { StudySession } from "@guesant/saberes-application";

export async function startAssessmentSimulationSession(input: StartAssessmentSimulationSessionInput): Promise<void> {
  const questionKeys = getAssessmentQuestionKeys(input.items);

  const readinessError = getAssessmentSimulationReadinessError(input);

  if (readinessError) {
    throw new Error(readinessError);
  }

  const timeLimitMs = input.assessment.duration_minutes * 60_000;

  const session: StudySession = {
    ...createQuestionStudySession({
      id: input.services.platform.ids.execute(),
      questionKeys,
      startedAt: new Date()
        .toISOString(),
      timeLimitMs,
    }),
    activityType: "assessment",
    contentKey: input.assessmentKey,
    mode: "simulation",
    revision: 0,
    simulationAnswers: [],
    flaggedQuestionKeys: [],
    questionWeights: createAssessmentQuestionWeights({ questionKeys, items: input.items }),
  };

  await input.services.progress.saveSession.execute(session);

  input.navigate(`/sessoes/questoes/${session.id}`);
}
