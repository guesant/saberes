export type GetMyStudyProgressErrorInput = {
  attemptsError: Error | null;
  reviewsError: Error | null;
  sessionsError: Error | null;
  streakError: Error | null;
  achievementsError: Error | null;
  topicMasteryError: Error | null;
  bookmarksError: Error | null;
};

export function getMyStudyProgressError(input: GetMyStudyProgressErrorInput): Error | null {
  return (
    [
      input.attemptsError,
      input.reviewsError,
      input.sessionsError,
      input.streakError,
      input.achievementsError,
      input.topicMasteryError,
      input.bookmarksError,
    ].find((error): error is Error => Boolean(error)) || null
  );
}
