import { createQuestionStudySession } from "../exercises/create-question-study-session.function";
import type { ApplicationServices, StudySession } from "@guesant/saberes-application";

export interface StartAssessmentStudySessionInput {
  assessmentKey: string;
  navigate(path: string): void;
  questionKeys: string[];
  services: ApplicationServices;
}

export async function startAssessmentStudySession(
  input: StartAssessmentStudySessionInput,
): Promise<void> {
  const session: StudySession = {
    ...createQuestionStudySession({
      id: input.services.platform.ids.execute(),
      questionKeys: input.questionKeys,
      startedAt: new Date().toISOString(),
    }),
    activityType: "assessment",
    contentKey: input.assessmentKey,
  };

  await input.services.progress.saveSession.execute(session);

  input.navigate(`/sessoes/questoes/${session.id}`);
}
