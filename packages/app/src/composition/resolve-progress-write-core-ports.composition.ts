import { applicationDependencyTokens } from "./application-dependency-tokens.config";
import { resolvePort } from "./resolve-port.composition";
import type { ApplicationPorts } from "@guesant/saberes-application";
import type { Container } from "inversify";

export function resolveProgressWriteCorePorts(
  container: Container,
): Pick<
  ApplicationPorts,
  | "recordAttempt"
  | "saveAttempt"
  | "saveSession"
  | "saveSetting"
  | "clearProgress"
  | "enrollCourse"
  | "importProgress"
  | "saveLessonProgress"
  | "savePlanProgress"
> {
  return {
    recordAttempt: resolvePort(container, applicationDependencyTokens.recordAttempt),
    saveAttempt: resolvePort(container, applicationDependencyTokens.saveAttempt),
    saveSession: resolvePort(container, applicationDependencyTokens.saveSession),
    saveSetting: resolvePort(container, applicationDependencyTokens.saveSetting),
    clearProgress: resolvePort(container, applicationDependencyTokens.clearProgress),
    enrollCourse: resolvePort(container, applicationDependencyTokens.enrollCourse),
    importProgress: resolvePort(container, applicationDependencyTokens.importProgress),
    saveLessonProgress: resolvePort(container, applicationDependencyTokens.saveLessonProgress),
    savePlanProgress: resolvePort(container, applicationDependencyTokens.savePlanProgress),
  };
}
