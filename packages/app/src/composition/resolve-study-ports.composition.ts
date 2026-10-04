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
    ...resolveStudySchedulerPorts(container),
    ...resolveStudyActivityPorts(container),
  };
}
