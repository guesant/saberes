import { applicationDependencyTokens } from "./application-dependency-tokens.config";
import { resolvePort } from "./resolve-port.composition";
import type { ApplicationPorts } from "@guesant/saberes-application";
import type { Container } from "inversify";

export function resolveProgressWriteReviewPorts(
  container: Container,
): Pick<
  ApplicationPorts,
  | "saveBookmark"
  | "removeBookmark"
  | "saveReviewItem"
  | "saveReviewTarget"
  | "saveDiagnosis"
  | "saveDailyChallenge"
  | "saveStreak"
  | "saveAchievement"
  | "saveTopicMastery"
> {
  return {
    saveBookmark: resolvePort(container, applicationDependencyTokens.saveBookmark),
    removeBookmark: resolvePort(container, applicationDependencyTokens.removeBookmark),
    saveReviewItem: resolvePort(container, applicationDependencyTokens.saveReviewItem),
    saveReviewTarget: resolvePort(container, applicationDependencyTokens.saveReviewTarget),
    saveDiagnosis: resolvePort(container, applicationDependencyTokens.saveDiagnosis),
    saveDailyChallenge: resolvePort(container, applicationDependencyTokens.saveDailyChallenge),
    saveStreak: resolvePort(container, applicationDependencyTokens.saveStreak),
    saveAchievement: resolvePort(container, applicationDependencyTokens.saveAchievement),
    saveTopicMastery: resolvePort(container, applicationDependencyTokens.saveTopicMastery),
  };
}
