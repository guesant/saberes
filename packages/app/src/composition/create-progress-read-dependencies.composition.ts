import {
  GetSessionAdapter,
  GetSettingAdapter,
  GetStreakAdapter,
  ListAchievementsAdapter,
  ListAttemptsAdapter,
  ListBookmarksAdapter,
  ListDailyChallengesAdapter,
  ListDiagnosesAdapter,
  ListEnrollmentsAdapter,
  ListLessonProgressAdapter,
  ListPlanProgressAdapter,
  ListReviewItemsAdapter,
  ListReviewTargetsAdapter,
  ListTopicMasteryAdapter,
} from "@guesant/saberes-adapter-data-v1";
import type { DexieProgressStore } from "@guesant/saberes-adapter-data-v1";
import type { ApplicationPorts } from "@guesant/saberes-application";

export function createProgressReadDependencies(
  store: DexieProgressStore,
): Partial<ApplicationPorts> {
  return {
    listAttempts: new ListAttemptsAdapter(store),
    getSession: new GetSessionAdapter(store),
    getSetting: new GetSettingAdapter(store),
    listEnrollments: new ListEnrollmentsAdapter(store),
    listLessonProgress: new ListLessonProgressAdapter(store),
    listPlanProgress: new ListPlanProgressAdapter(store),
    listBookmarks: new ListBookmarksAdapter(store),
    listReviewItems: new ListReviewItemsAdapter(store),
    listReviewTargets: new ListReviewTargetsAdapter(store),
    listDiagnoses: new ListDiagnosesAdapter(store),
    listDailyChallenges: new ListDailyChallengesAdapter(store),
    getStreak: new GetStreakAdapter(store),
    listAchievements: new ListAchievementsAdapter(store),
    listTopicMastery: new ListTopicMasteryAdapter(store),
  };
}
