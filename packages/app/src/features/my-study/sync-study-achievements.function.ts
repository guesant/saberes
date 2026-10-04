import type { ApplicationServices } from "@guesant/saberes-application";

export async function syncStudyAchievements(services: ApplicationServices): Promise<void> {
  const [attempts, lessons, streak] = await Promise.all([
    services.progress.listAttempts.execute(),
    services.progress.listLessonProgress.execute(),
    services.progress.getStreak.execute(),
  ]);

  await services.study.syncAchievements.execute({
    attempts: attempts.length,
    correct: attempts.filter((attempt) => {
      return attempt.isCorrect === true;
    }).length,
    lessons: lessons.filter((lesson) => {
      return lesson.completed === true;
    }).length,
    streak: Number(streak?.current || 0),
  });
}
