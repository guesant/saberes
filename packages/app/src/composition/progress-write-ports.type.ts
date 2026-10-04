import type { ApplicationPorts } from "@guesant/saberes-application";

export type ProgressWritePorts = Pick<
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
  | "saveSavedCatalogFilter"
  | "deleteSavedCatalogFilter"
  | "saveBookmark"
  | "saveReviewItem"
  | "saveReviewTarget"
  | "saveDiagnosis"
  | "saveDailyChallenge"
  | "saveFocusSession"
  | "saveStreak"
  | "saveStudyGoal"
  | "savePersonalWorkspace"
  | "saveAchievement"
  | "saveAcademicDiscipline"
  | "deleteAcademicDiscipline"
  | "saveTopicMastery"
>;
