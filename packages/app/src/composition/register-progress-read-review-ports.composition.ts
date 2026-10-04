import {
  type ProgressStorageContract,
  ExportProgressAdapter,
  GetStreakAdapter,
  ListAchievementsAdapter,
  ListDailyChallengesAdapter,
  ListDiagnosesAdapter,
  ListReviewTargetsAdapter,
  ListTopicMasteryAdapter,
} from "@guesant/saberes-adapter-data-v1";
import { applicationDependencyTokens } from "./application-dependency-tokens.config";
import { registerPortFactories } from "./register-port-factories.composition";
import { resolvePort } from "./resolve-port.composition";
import type { PortFactoryBinding } from "./port-factory-binding.type";
import type { Container } from "inversify";

export function createProgressReadReviewPortBindings(container: Container): void {
  const getProgressStore = (): ProgressStorageContract =>
    resolvePort<ProgressStorageContract>(container, applicationDependencyTokens.progressStore);

  const bindings: PortFactoryBinding[] = [
    [
      applicationDependencyTokens.listReviewTargets,
      () => new ListReviewTargetsAdapter(getProgressStore()),
    ],
    [applicationDependencyTokens.listDiagnoses, () => new ListDiagnosesAdapter(getProgressStore())],
    [
      applicationDependencyTokens.listDailyChallenges,
      () => new ListDailyChallengesAdapter(getProgressStore()),
    ],
    [applicationDependencyTokens.getStreak, () => new GetStreakAdapter(getProgressStore())],
    [
      applicationDependencyTokens.exportProgress,
      () => new ExportProgressAdapter(getProgressStore()),
    ],
    [
      applicationDependencyTokens.listAchievements,
      () => new ListAchievementsAdapter(getProgressStore()),
    ],
    [
      applicationDependencyTokens.listTopicMastery,
      () => new ListTopicMasteryAdapter(getProgressStore()),
    ],
  ];

  registerPortFactories(container, bindings);
}
