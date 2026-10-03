import {
  AchievementDefinitionsAdapter,
  ActionForDiagnosisAdapter,
  AddStudyPointsAdapter,
  CalculateTopicMasteryAdapter,
  DateFnsClockAdapter,
  RecommendNextAdapter,
  RecordStudyActivityAdapter,
  SyncAchievementsAdapter,
  SuggestDiagnosisAdapter,
  TsFsrsPreviewReviewAdapter,
  TsFsrsScheduleReviewAdapter,
  CryptoIdAdapter,
} from "@guesant/saberes-adapter-data-v1";
import type { ApplicationPorts } from "@guesant/saberes-application";

export function createStudyDependencies(): Partial<ApplicationPorts> {
  return {
    scheduleReview: new TsFsrsScheduleReviewAdapter(),
    previewReview: new TsFsrsPreviewReviewAdapter(),
    recordStudyActivity: new RecordStudyActivityAdapter(),
    calculateTopicMastery: new CalculateTopicMasteryAdapter(),
    suggestDiagnosis: new SuggestDiagnosisAdapter(),
    actionForDiagnosis: new ActionForDiagnosisAdapter(),
    recommendNext: new RecommendNextAdapter(),
    achievementDefinitions: new AchievementDefinitionsAdapter(),
    syncAchievements: new SyncAchievementsAdapter(),
    addStudyPoints: new AddStudyPointsAdapter(),
    clock: new DateFnsClockAdapter(),
    ids: new CryptoIdAdapter(),
  };
}
