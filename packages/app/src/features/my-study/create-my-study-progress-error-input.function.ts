import type { GetMyStudyProgressErrorInput } from "./get-my-study-progress-error.function";
import type { MyStudyProgressQueries } from "./use-my-study-progress-queries.hook";

export function createMyStudyProgressErrorInput(
  progress: MyStudyProgressQueries,
): GetMyStudyProgressErrorInput {
  return {
    attemptsError: progress.attemptsError,
    reviewsError: progress.reviewsError,
    sessionsError: progress.sessionsError,
    streakError: progress.streakError,
    achievementsError: progress.achievementsError,
    topicMasteryError: progress.topicMasteryError,
    bookmarksError: progress.bookmarksError,
  };
}
