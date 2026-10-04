import { applicationDependencyTokens } from "./application-dependency-tokens.config";
import { resolvePort } from "./resolve-port.composition";
import type { ApplicationPorts } from "@guesant/saberes-application";
import type { Container } from "inversify";

export function resolveProgressReadReviewPorts(
  container: Container,
): Pick<
  ApplicationPorts,
  | "listReviewTargets"
  | "listDiagnoses"
  | "listDailyChallenges"
  | "getStreak"
  | "exportProgress"
  | "listAchievements"
  | "listTopicMastery"
> {
  return {
    listReviewTargets: resolvePort(container, applicationDependencyTokens.listReviewTargets),
    listDiagnoses: resolvePort(container, applicationDependencyTokens.listDiagnoses),
    listDailyChallenges: resolvePort(container, applicationDependencyTokens.listDailyChallenges),
    getStreak: resolvePort(container, applicationDependencyTokens.getStreak),
    exportProgress: resolvePort(container, applicationDependencyTokens.exportProgress),
    listAchievements: resolvePort(container, applicationDependencyTokens.listAchievements),
    listTopicMastery: resolvePort(container, applicationDependencyTokens.listTopicMastery),
  };
}
