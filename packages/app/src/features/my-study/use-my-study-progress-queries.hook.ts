import { useMyStudyAchievementQueries } from "./use-my-study-achievement-queries.hook";
import { useMyStudyActivityQueries } from "./use-my-study-activity-queries.hook";
import { useMyStudyBookmarkQueries } from "./use-my-study-bookmark-queries.hook";
import { useMyStudyMasteryQueries } from "./use-my-study-mastery-queries.hook";
import type {
  ApplicationServices,
  Attempt,
  ReviewTarget,
  StudyRecord,
} from "@guesant/saberes-application";

export type MyStudyProgressQueries = {
  attempts: Attempt[] | undefined;
  reviews: ReviewTarget[] | undefined;
  streak: StudyRecord | undefined;
  achievements: StudyRecord[] | undefined;
  topicMastery: StudyRecord[] | undefined;
  bookmarks: StudyRecord[] | undefined;
  attemptsError: Error | null;
  reviewsError: Error | null;
  streakError: Error | null;
  achievementsError: Error | null;
  topicMasteryError: Error | null;
  bookmarksError: Error | null;
  reload: () => Promise<void>;
};

export function useMyStudyProgressQueries(services: ApplicationServices): MyStudyProgressQueries {
  const activityQueries = useMyStudyActivityQueries(services);

  const achievementQueries = useMyStudyAchievementQueries(services);

  const masteryQueries = useMyStudyMasteryQueries(services);

  const bookmarkQueries = useMyStudyBookmarkQueries(services);

  return {
    attempts: activityQueries.attempts,
    reviews: activityQueries.reviews,
    streak: achievementQueries.streak,
    achievements: achievementQueries.achievements,
    topicMastery: masteryQueries.topicMastery,
    bookmarks: bookmarkQueries.bookmarks,
    attemptsError: activityQueries.attemptsError,
    reviewsError: activityQueries.reviewsError,
    streakError: achievementQueries.streakError,
    achievementsError: achievementQueries.achievementsError,
    topicMasteryError: masteryQueries.error,
    bookmarksError: bookmarkQueries.error,
    reload: async (): Promise<void> => {
      await Promise.all([
        activityQueries.reload(),
        achievementQueries.reload(),
        masteryQueries.reload(),
        bookmarkQueries.reload(),
      ]);
    },
  };
}
