import { applicationDependencyTokens } from "./application-dependency-tokens.config";
import { resolvePort } from "./resolve-port.composition";
import type { ApplicationPorts } from "@guesant/saberes-application";
import type { Container } from "inversify";

export function resolveStudyActivityPorts(
  container: Container,
): Pick<
  ApplicationPorts,
  | "recordStudyActivity"
  | "calculateTopicMastery"
  | "suggestDiagnosis"
  | "actionForDiagnosis"
  | "recommendNext"
  | "achievementDefinitions"
  | "syncAchievements"
  | "addStudyPoints"
  | "clock"
  | "ids"
> {
  return {
    recordStudyActivity: resolvePort(container, applicationDependencyTokens.recordStudyActivity),
    calculateTopicMastery: resolvePort(
      container,
      applicationDependencyTokens.calculateTopicMastery,
    ),
    suggestDiagnosis: resolvePort(container, applicationDependencyTokens.suggestDiagnosis),
    actionForDiagnosis: resolvePort(container, applicationDependencyTokens.actionForDiagnosis),
    recommendNext: resolvePort(container, applicationDependencyTokens.recommendNext),
    achievementDefinitions: resolvePort(
      container,
      applicationDependencyTokens.achievementDefinitions,
    ),
    syncAchievements: resolvePort(container, applicationDependencyTokens.syncAchievements),
    addStudyPoints: resolvePort(container, applicationDependencyTokens.addStudyPoints),
    clock: resolvePort(container, applicationDependencyTokens.clock),
    ids: resolvePort(container, applicationDependencyTokens.ids),
  };
}
