export type GetMyStudyProgressErrorInput = {
  attemptsError: Error | null;
  reviewsError: Error | null;
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
      input.streakError,
      input.achievementsError,
      input.topicMasteryError,
      input.bookmarksError,
    ].find((error): error is Error => Boolean(error)) || null
  );
}
