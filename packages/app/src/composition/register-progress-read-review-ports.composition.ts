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
  const getProgressStore = (): ProgressStorageContract => { return resolvePort<ProgressStorageContract>(container, applicationDependencyTokens.progressStore); };

  const bindings: PortFactoryBinding[] = [
    [applicationDependencyTokens.listReviewTargets, () => { return new ListReviewTargetsAdapter(getProgressStore()); }],
    [applicationDependencyTokens.listDiagnoses, () => { return new ListDiagnosesAdapter(getProgressStore()); }],
    [applicationDependencyTokens.listDailyChallenges, () => { return new ListDailyChallengesAdapter(getProgressStore()); }],
    [applicationDependencyTokens.getStreak, () => { return new GetStreakAdapter(getProgressStore()); }],
    [applicationDependencyTokens.exportProgress, () => { return new ExportProgressAdapter(getProgressStore()); }],
    [applicationDependencyTokens.listAchievements, () => { return new ListAchievementsAdapter(getProgressStore()); }],
    [applicationDependencyTokens.listTopicMastery, () => { return new ListTopicMasteryAdapter(getProgressStore()); }],
  ];

  registerPortFactories(container, bindings);
}
