import { applicationDependencyTokens } from "./application-dependency-tokens.config";
import { resolvePort } from "./resolve-port.composition";
import { resolveStudyActivityPorts } from "./resolve-study-activity-ports.composition";
import { resolveStudySchedulerPorts } from "./resolve-study-scheduler-ports.composition";
import type { ApplicationPorts } from "@guesant/saberes-application";
import type { Container } from "inversify";

export function resolveStudyPorts(
  container: Container,
): Pick<
  ApplicationPorts,
  | "scheduleReview"
  | "previewReview"
  | "recordStudyActivity"
  | "calculateTopicMastery"
  | "calculateAcademicMetrics"
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
    calculateAcademicMetrics: resolvePort<ApplicationPorts["calculateAcademicMetrics"]>(
      container,
      applicationDependencyTokens.calculateAcademicMetrics,
    ),
    ...resolveStudySchedulerPorts(container),
    ...resolveStudyActivityPorts(container),
  };
}
