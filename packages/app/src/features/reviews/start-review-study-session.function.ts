import type { ApplicationServices, ReviewTarget, StudySession } from "@guesant/saberes-application";

export interface StartReviewStudySessionInput {
  services: ApplicationServices;
  targets: ReviewTarget[];
}

export async function startReviewStudySession(
  input: StartReviewStudySessionInput,
): Promise<string | null> {
  const questionKeys = input.targets
    .map((target) => String(target.contentKey))
    .filter((contentKey) => contentKey.startsWith("question:"));

  if (!questionKeys.length) {
    return null;
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

  return session.id;
}
