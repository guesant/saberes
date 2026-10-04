import {
  type ProgressStorageContract,
  SaveAchievementAdapter,
  SaveBookmarkAdapter,
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
  const getProgressStore = (): ProgressStorageContract =>
    resolvePort<ProgressStorageContract>(container, applicationDependencyTokens.progressStore);

  const bindings: PortFactoryBinding[] = [
    [applicationDependencyTokens.saveBookmark, () => new SaveBookmarkAdapter(getProgressStore())],
    [
      applicationDependencyTokens.saveReviewItem,
      () => new SaveReviewItemAdapter(getProgressStore()),
    ],
    [
      applicationDependencyTokens.saveReviewTarget,
      () => new SaveReviewTargetAdapter(getProgressStore()),
    ],
    [applicationDependencyTokens.saveDiagnosis, () => new SaveDiagnosisAdapter(getProgressStore())],
    [
      applicationDependencyTokens.saveDailyChallenge,
      () => new SaveDailyChallengeAdapter(getProgressStore()),
    ],
    [applicationDependencyTokens.saveStreak, () => new SaveStreakAdapter(getProgressStore())],
    [
      applicationDependencyTokens.saveAchievement,
      () => new SaveAchievementAdapter(getProgressStore()),
    ],
    [
      applicationDependencyTokens.saveTopicMastery,
      () => new SaveTopicMasteryAdapter(getProgressStore()),
    ],
  ];

  registerPortFactories(container, bindings);
}
