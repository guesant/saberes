import { resolveProgressWriteCorePorts } from "./resolve-progress-write-core-ports.composition";
import { resolveProgressWriteReviewPorts } from "./resolve-progress-write-review-ports.composition";
import type { ApplicationPorts } from "@guesant/saberes-application";
import type { Container } from "inversify";

export function resolveProgressWritePorts(
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
  | "saveBookmark"
  | "saveReviewItem"
  | "saveReviewTarget"
  | "saveDiagnosis"
  | "saveDailyChallenge"
  | "saveStreak"
  | "saveAchievement"
  | "saveTopicMastery"
> {
  return {
    ...resolveProgressWriteCorePorts(container),
    ...resolveProgressWriteReviewPorts(container),
  };
}
