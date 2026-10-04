import {
  AchievementDefinitionsAdapter,
  ActionForDiagnosisAdapter,
  AddStudyPointsAdapter,
  CalculateTopicMasteryAdapter,
  CryptoIdAdapter,
  DateFnsClockAdapter,
  RecommendNextAdapter,
  RecordStudyActivityAdapter,
  SuggestDiagnosisAdapter,
  SyncAchievementsAdapter,
  TsFsrsPreviewReviewAdapter,
  TsFsrsScheduleReviewAdapter,
  type ProgressStorageContract,
} from "@guesant/saberes-adapter-data-v1";
import { applicationDependencyTokens } from "./application-dependency-tokens.config";
import { registerPortFactories } from "./register-port-factories.composition";
import { resolvePort } from "./resolve-port.composition";
import type { Container } from "inversify";

export function createStudyDependencies(container: Container): void {
  const getProgressStore = (): ProgressStorageContract =>
    resolvePort<ProgressStorageContract>(container, applicationDependencyTokens.progressStore);

  const bindings: Array<readonly [symbol, () => object]> = [
    [applicationDependencyTokens.scheduleReview, () => new TsFsrsScheduleReviewAdapter()],
    [applicationDependencyTokens.previewReview, () => new TsFsrsPreviewReviewAdapter()],
    [
      applicationDependencyTokens.recordStudyActivity,
      () => new RecordStudyActivityAdapter(getProgressStore()),
    ],
    [applicationDependencyTokens.calculateTopicMastery, () => new CalculateTopicMasteryAdapter()],
    [applicationDependencyTokens.suggestDiagnosis, () => new SuggestDiagnosisAdapter()],
    [applicationDependencyTokens.actionForDiagnosis, () => new ActionForDiagnosisAdapter()],
    [applicationDependencyTokens.recommendNext, () => new RecommendNextAdapter()],
    [applicationDependencyTokens.achievementDefinitions, () => new AchievementDefinitionsAdapter()],
    [
      applicationDependencyTokens.syncAchievements,
      () => new SyncAchievementsAdapter(getProgressStore()),
    ],
    [
      applicationDependencyTokens.addStudyPoints,
      () => new AddStudyPointsAdapter(getProgressStore()),
    ],
    [applicationDependencyTokens.clock, () => new DateFnsClockAdapter()],
    [applicationDependencyTokens.ids, () => new CryptoIdAdapter()],
  ];

  registerPortFactories(container, bindings);
}
