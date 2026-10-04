import type { ApplicationServices, ReviewTarget, StudySession } from "@guesant/saberes-application";

export interface StartReviewStudySessionInput {
  navigate: (path: string) => void;
  services: ApplicationServices;
  targets: ReviewTarget[];
}

export async function startReviewStudySession(input: StartReviewStudySessionInput): Promise<void> {
  const questionKeys = input.targets
    .map((target) => String(target.contentKey))
    .filter((contentKey) => contentKey.startsWith("question:"));

  if (!questionKeys.length) {
    return;
  }

  const session: StudySession = {
    id: input.services.platform.ids.execute(),
    activityType: "review",
    startedAt: new Date().toISOString(),
    questionKeys,
    currentIndex: 0,
    status: "active",
    answeredQuestionKeys: [],
    skippedQuestionKeys: [],
    correctAnswers: 0,
  };

  await input.services.progress.saveSession.execute(session);

  input.navigate(`/sessoes/questoes/${session.id}`);
}
