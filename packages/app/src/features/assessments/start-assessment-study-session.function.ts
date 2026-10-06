import { createQuestionStudySession } from "../exercises/create-question-study-session.function";
import type { StartAssessmentStudySessionInput } from "./start-assessment-study-session-input.interface";
import type { StudySession } from "@guesant/saberes-application";

export async function startAssessmentStudySession(
  input: StartAssessmentStudySessionInput,
): Promise<void> {
  const session: StudySession = {
    ...createQuestionStudySession({
      id: input.services.platform.ids.execute(),
      questionKeys: input.questionKeys,
      startedAt: new Date()
        .toISOString(),
    }),
    activityType: "assessment",
    mode: "practice",
    contentKey: input.assessmentKey,
  };

  await input.services.progress.saveSession.execute(session);

  input.navigate(`/sessoes/questoes/${session.id}`);
}
