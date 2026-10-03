import {
  ClearProgressAdapter,
  EnrollCourseAdapter,
  RecordAttemptAdapter,
  SaveAchievementAdapter,
  SaveAttemptAdapter,
  SaveBookmarkAdapter,
  SaveDailyChallengeAdapter,
  SaveDiagnosisAdapter,
  SaveLessonProgressAdapter,
  SavePlanProgressAdapter,
  SaveReviewItemAdapter,
  SaveReviewTargetAdapter,
  SaveSessionAdapter,
  SaveSettingAdapter,
  SaveStreakAdapter,
} from "@guesant/saberes-adapter-data-v1";
import type { DexieProgressStore } from "@guesant/saberes-adapter-data-v1";
import type { ApplicationPorts } from "@guesant/saberes-application";

export function createProgressWriteDependencies(
  store: DexieProgressStore,
): Partial<ApplicationPorts> {
  return {
    recordAttempt: new RecordAttemptAdapter(store),
    saveAttempt: new SaveAttemptAdapter(store),
    saveSession: new SaveSessionAdapter(store),
    saveSetting: new SaveSettingAdapter(store),
    clearProgress: new ClearProgressAdapter(store),
    enrollCourse: new EnrollCourseAdapter(store),
    saveLessonProgress: new SaveLessonProgressAdapter(store),
    savePlanProgress: new SavePlanProgressAdapter(store),
    saveBookmark: new SaveBookmarkAdapter(store),
    saveReviewItem: new SaveReviewItemAdapter(store),
    saveReviewTarget: new SaveReviewTargetAdapter(store),
    saveDiagnosis: new SaveDiagnosisAdapter(store),
    saveDailyChallenge: new SaveDailyChallengeAdapter(store),
    saveStreak: new SaveStreakAdapter(store),
    saveAchievement: new SaveAchievementAdapter(store),
  };
}
