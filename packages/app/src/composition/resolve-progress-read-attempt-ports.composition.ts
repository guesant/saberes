import { applicationDependencyTokens } from "./application-dependency-tokens.config";
import { resolvePort } from "./resolve-port.composition";
import type { ApplicationPorts } from "@guesant/saberes-application";
import type { Container } from "inversify";

export function resolveProgressReadAttemptPorts(
  container: Container,
): Pick<
  ApplicationPorts,
  | "listAttempts"
  | "getSession"
  | "getSetting"
  | "listEnrollments"
  | "listLessonProgress"
  | "listPlanProgress"
  | "listBookmarks"
  | "listReviewItems"
  | "listStudySessions"
> {
  return {
    listAttempts: resolvePort(container, applicationDependencyTokens.listAttempts),
    getSession: resolvePort(container, applicationDependencyTokens.getSession),
    getSetting: resolvePort(container, applicationDependencyTokens.getSetting),
    listEnrollments: resolvePort(container, applicationDependencyTokens.listEnrollments),
    listLessonProgress: resolvePort(container, applicationDependencyTokens.listLessonProgress),
    listPlanProgress: resolvePort(container, applicationDependencyTokens.listPlanProgress),
    listBookmarks: resolvePort(container, applicationDependencyTokens.listBookmarks),
    listReviewItems: resolvePort(container, applicationDependencyTokens.listReviewItems),
    listStudySessions: resolvePort(container, applicationDependencyTokens.listStudySessions),
  };
}
