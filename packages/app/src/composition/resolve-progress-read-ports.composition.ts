import { resolveProgressReadAdditionalPorts } from "./resolve-progress-read-additional-ports.composition";
import { resolveProgressReadAttemptPorts } from "./resolve-progress-read-attempt-ports.composition";
import { resolveProgressReadReviewPorts } from "./resolve-progress-read-review-ports.composition";
import type { ApplicationPorts } from "@guesant/saberes-application";
import type { Container } from "inversify";

export function resolveProgressReadPorts(
  container: Container,
): Pick<
  ApplicationPorts,
  | "listAttempts"
  | "listAcademicDisciplines"
  | "listFocusSessions"
  | "listStudyGoals"
  | "getPersonalWorkspace"
  | "listCalendarEntries"
  | "listPersonalReminderCandidates"
  | "listPersonalRelations"
  | "getSession"
  | "getSetting"
  | "listEnrollments"
  | "listLessonProgress"
  | "listPlanProgress"
  | "listBookmarks"
  | "listReviewItems"
  | "listStudySessions"
  | "listSavedCatalogFilters"
  | "listReviewTargets"
  | "listDiagnoses"
  | "listDailyChallenges"
  | "getStreak"
  | "exportProgress"
  | "listAchievements"
  | "listTopicMastery"
> {
  return {
    ...resolveProgressReadAdditionalPorts(container),
    ...resolveProgressReadAttemptPorts(container),
    ...resolveProgressReadReviewPorts(container),
  };
}
