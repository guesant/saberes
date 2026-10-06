import {
  AchievementDefinitionsAdapter,
  ActionForDiagnosisAdapter,
  AddStudyPointsAdapter,
  CalculateTopicMasteryAdapter,
  CalculateAcademicMetricsAdapter,
  CompleteSimulationSessionAdapter,
  CryptoIdAdapter,
  DateFnsClockAdapter,
  type ProgressDatabaseContract,
  RecommendNextAdapter,
  RecordStudyActivityAdapter,
  SuggestDiagnosisAdapter,
  SyncAchievementsAdapter,
  TsFsrsPreviewReviewAdapter,
  TsFsrsScheduleReviewAdapter,
  UpdateSimulationSessionAdapter,
  type ProgressStorageContract,
} from "@guesant/saberes-adapter-data-v1";
import { applicationDependencyTokens } from "./application-dependency-tokens.config";
import { registerPortFactories } from "./register-port-factories.composition";
import { resolvePort } from "./resolve-port.composition";
import type { PortFactoryBinding } from "./port-factory-binding.type";
import type { Container } from "inversify";

export function createStudyDependencies(container: Container): void {
  const getProgressStore = (): ProgressStorageContract => { return resolvePort<ProgressStorageContract>(container, applicationDependencyTokens.progressStore); };

  const getProgressDatabase = (): ProgressDatabaseContract => { return resolvePort<ProgressDatabaseContract>(container, applicationDependencyTokens.progressDatabase); };

  const bindings: PortFactoryBinding[] = [
    [applicationDependencyTokens.scheduleReview, () => { return new TsFsrsScheduleReviewAdapter(); }],
    [applicationDependencyTokens.previewReview, () => { return new TsFsrsPreviewReviewAdapter(); }],
    [applicationDependencyTokens.recordStudyActivity, () => { return new RecordStudyActivityAdapter(getProgressStore()); }],
    [applicationDependencyTokens.calculateTopicMastery, () => { return new CalculateTopicMasteryAdapter(); }],
    [applicationDependencyTokens.calculateAcademicMetrics, () => { return new CalculateAcademicMetricsAdapter(); }],
    [applicationDependencyTokens.suggestDiagnosis, () => { return new SuggestDiagnosisAdapter(); }],
    [applicationDependencyTokens.actionForDiagnosis, () => { return new ActionForDiagnosisAdapter(); }],
    [applicationDependencyTokens.recommendNext, () => { return new RecommendNextAdapter(); }],
    [applicationDependencyTokens.achievementDefinitions, () => { return new AchievementDefinitionsAdapter(); }],
    [applicationDependencyTokens.syncAchievements, () => { return new SyncAchievementsAdapter(getProgressStore()); }],
    [applicationDependencyTokens.addStudyPoints, () => { return new AddStudyPointsAdapter(getProgressStore()); }],
    [applicationDependencyTokens.clock, () => { return new DateFnsClockAdapter(); }],
    [applicationDependencyTokens.ids, () => { return new CryptoIdAdapter(); }],
    [applicationDependencyTokens.updateSimulationSession, () => { return new UpdateSimulationSessionAdapter(getProgressDatabase()); }],
    [applicationDependencyTokens.completeSimulationSession, () => { return new CompleteSimulationSessionAdapter(getProgressDatabase()); }],
  ];

  registerPortFactories(container, bindings);
}
