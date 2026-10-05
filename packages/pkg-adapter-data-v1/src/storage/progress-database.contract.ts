import type { AttemptDiagnosis } from "./attempt-diagnosis.interface";
import type { AttemptWithId } from "./attempt-with-id.interface";
import type { Attempt } from "./attempt.type";
import type { PersonalSearchIndexEntry } from "./personal-search-index-entry.interface";
import type { ProgressBackupEvent } from "./progress-backup-event.interface";
import type { ProgressSettingRecord } from "./progress-setting-record.interface";
import type { ReviewEventInput } from "./review-event-input.interface";
import type { ReviewTarget } from "./review-target.interface";
import type { SessionRecord } from "./session-record.interface";
import type { ImportProgressInput, SavedCatalogFilter } from "@guesant/saberes-application";
import type {
  AcademicDiscipline,
  FocusSession,
  PersonalWorkspace,
  ReviewTargetRecord,
  StudyGoal,
} from "@guesant/saberes-domain";

export interface ProgressDatabaseContract {
  clearProgress(): Promise<void>;

  enrollCourse(
    contentKey: string,
    data?: Record<string, unknown>,
  ): Promise<Record<string, unknown>>;

  exportProgress(): Promise<string>;

  getSession(id: string): Promise<SessionRecord | undefined>;

  getSetting(key: string): Promise<ProgressSettingRecord | undefined>;

  getStreak(): Promise<Record<string, unknown>>;

  importProgress(input: ImportProgressInput): Promise<void>;

  listBackupEvents(): Promise<ProgressBackupEvent[]>;

  listAchievements(): Promise<Array<Record<string, unknown>>>;

  listAcademicDisciplines(): Promise<AcademicDiscipline[]>;

  listAttempts(): Promise<AttemptWithId[]>;

  listBookmarks(): Promise<Array<Record<string, unknown>>>;

  listDailyChallenges(): Promise<Array<Record<string, unknown>>>;

  listDiagnoses(): Promise<Array<AttemptDiagnosis>>;

  listEnrollments(): Promise<Array<Record<string, unknown>>>;

  listFocusSessions(): Promise<FocusSession[]>;

  listLessonProgress(): Promise<Array<Record<string, unknown>>>;

  listPlanProgress(): Promise<Array<Record<string, unknown>>>;

  listReviewItems(): Promise<Array<Record<string, unknown>>>;

  listReviewTargets(): Promise<Array<ReviewTargetRecord>>;

  listSessions(): Promise<Array<SessionRecord>>;

  listStudyGoals(): Promise<StudyGoal[]>;

  listSavedCatalogFilters(): Promise<SavedCatalogFilter[]>;

  listTopicMastery(): Promise<Array<Record<string, unknown>>>;

  getPersonalWorkspace(): Promise<PersonalWorkspace>;

  listPersonalSearchIndex(): Promise<PersonalSearchIndexEntry[]>;

  saveAchievement(
    contentKey: string,
    data?: Record<string, unknown>,
  ): Promise<Record<string, unknown>>;

  saveAcademicDiscipline(discipline: AcademicDiscipline): Promise<AcademicDiscipline>;

  deleteAcademicDiscipline(id: string): Promise<void>;

  saveAttempt(attempt: Attempt): Promise<AttemptWithId>;

  saveBookmark(
    contentKey: string,
    data?: Record<string, unknown>,
  ): Promise<Record<string, unknown>>;

  saveDailyChallenge(
    contentKey: string,
    data?: Record<string, unknown>,
  ): Promise<Record<string, unknown>>;

  saveDiagnosis(diagnosis: AttemptDiagnosis): Promise<void>;

  saveFocusSession(session: FocusSession): Promise<FocusSession>;

  saveLessonProgress(
    contentKey: string,
    data?: Record<string, unknown>,
  ): Promise<Record<string, unknown>>;

  savePlanProgress(
    contentKey: string,
    data?: Record<string, unknown>,
  ): Promise<Record<string, unknown>>;

  saveReviewEvent(event: ReviewEventInput): Promise<void>;

  saveReviewItem(
    contentKey: string,
    data?: Record<string, unknown>,
  ): Promise<Record<string, unknown>>;

  saveReviewTarget(contentKey: string, data?: Partial<ReviewTarget>): Promise<ReviewTarget>;

  saveSession(session: SessionRecord): Promise<void>;

  saveSavedCatalogFilter(filter: SavedCatalogFilter): Promise<void>;

  deleteSavedCatalogFilter(id: string): Promise<void>;

  saveSetting(key: string, value: unknown): Promise<void>;

  saveStreak(data?: Record<string, unknown>): Promise<Record<string, unknown>>;

  saveStudyGoal(goal: StudyGoal): Promise<StudyGoal>;

  saveTopicMastery(
    contentKey: string,
    data?: Record<string, unknown>,
  ): Promise<Record<string, unknown>>;

  savePersonalWorkspace(workspace: PersonalWorkspace): Promise<PersonalWorkspace>;
}
