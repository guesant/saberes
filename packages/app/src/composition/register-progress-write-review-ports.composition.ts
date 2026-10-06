import {
  type ProgressStorageContract,
  SaveAchievementAdapter,
  SaveBookmarkAdapter,
  RemoveBookmarkAdapter,
  SaveDailyChallengeAdapter,
  SaveDiagnosisAdapter,
  SaveReviewItemAdapter,
  SaveReviewTargetAdapter,
  SaveStreakAdapter,
  SaveTopicMasteryAdapter,
} from "@guesant/saberes-adapter-data-v1";
import { applicationDependencyTokens } from "./application-dependency-tokens.config";
import { registerPortFactories } from "./register-port-factories.composition";
import { resolvePort } from "./resolve-port.composition";
import type { PortFactoryBinding } from "./port-factory-binding.type";
import type { Container } from "inversify";

export function createProgressWriteReviewPortBindings(container: Container): void {
  const getProgressStore = (): ProgressStorageContract => { return resolvePort<ProgressStorageContract>(container, applicationDependencyTokens.progressStore); };

  const bindings: PortFactoryBinding[] = [
    [applicationDependencyTokens.saveBookmark, () => { return new SaveBookmarkAdapter(getProgressStore()); }],
    [applicationDependencyTokens.removeBookmark, () => { return new RemoveBookmarkAdapter(getProgressStore()); }],
    [applicationDependencyTokens.saveReviewItem, () => { return new SaveReviewItemAdapter(getProgressStore()); }],
    [applicationDependencyTokens.saveReviewTarget, () => { return new SaveReviewTargetAdapter(getProgressStore()); }],
    [applicationDependencyTokens.saveDiagnosis, () => { return new SaveDiagnosisAdapter(getProgressStore()); }],
    [applicationDependencyTokens.saveDailyChallenge, () => { return new SaveDailyChallengeAdapter(getProgressStore()); }],
    [applicationDependencyTokens.saveStreak, () => { return new SaveStreakAdapter(getProgressStore()); }],
    [applicationDependencyTokens.saveAchievement, () => { return new SaveAchievementAdapter(getProgressStore()); }],
    [applicationDependencyTokens.saveTopicMastery, () => { return new SaveTopicMasteryAdapter(getProgressStore()); }],
  ];

  registerPortFactories(container, bindings);
}
