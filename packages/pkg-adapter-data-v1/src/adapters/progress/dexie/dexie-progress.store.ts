import type { AttemptDiagnosis } from "../../../storage/attempt-diagnosis.interface";
import type { Attempt } from "../../../storage/attempt.type";
import type { ProgressDatabaseContract } from "../../../storage/progress-database.contract";
import type { ProgressStorageContract } from "../../../storage/progress-storage.contract";
import type { ReviewTarget } from "../../../storage/review-target.type";
import type { SavedCatalogFilter } from "@guesant/saberes-application";
import type { DiagnosisRecord, AttemptRecord, ReviewTargetRecord } from "@guesant/saberes-domain";

type SessionRecord = { id: string; [key: string]: unknown };

export class DexieProgressStore implements ProgressStorageContract {
  public constructor(private readonly database: ProgressDatabaseContract) {}

  listAttempts() {
    return this.database.listAttempts() as Promise<AttemptRecord[]>;
  }

  saveAttempt(attempt: Attempt) {
    return this.database.saveAttempt(attempt);
  }

  recordAttempt(attempt: Attempt) {
    return this.database.saveAttempt(attempt);
  }

  async saveSession(session: SessionRecord): Promise<void> {
    await this.database.saveSession(session);
  }

  getSession(id: string) {
    return this.database.getSession(id);
  }

  listSessions() {
    return this.database.listSessions();
  }

  listSavedCatalogFilters(): Promise<SavedCatalogFilter[]> {
    return this.database.listSavedCatalogFilters();
  }

  saveSavedCatalogFilter(filter: SavedCatalogFilter): Promise<void> {
    return this.database.saveSavedCatalogFilter(filter);
  }

  deleteSavedCatalogFilter(id: string): Promise<void> {
    return this.database.deleteSavedCatalogFilter(id);
  }

  async saveSetting(key: string, value: unknown): Promise<void> {
    await this.database.saveSetting(key, value);
  }

  getSetting(key: string) {
    return this.database.getSetting(key);
  }

  clear() {
    return this.database.clearProgress();
  }

  enrollCourse(contentKey: string, data: Record<string, unknown> = {}) {
    return this.database.enrollCourse(contentKey, data);
  }

  listEnrollments() {
    return this.database.listEnrollments();
  }

  saveLessonProgress(contentKey: string, data: Record<string, unknown> = {}) {
    return this.database.saveLessonProgress(contentKey, data);
  }

  listLessonProgress() {
    return this.database.listLessonProgress();
  }

  savePlanProgress(contentKey: string, data: Record<string, unknown> = {}) {
    return this.database.savePlanProgress(contentKey, data);
  }

  listPlanProgress() {
    return this.database.listPlanProgress();
  }

  saveBookmark(contentKey: string, data: Record<string, unknown> = {}) {
    return this.database.saveBookmark(contentKey, data);
  }

  listBookmarks() {
    return this.database.listBookmarks();
  }

  saveReviewItem(contentKey: string, data: Record<string, unknown> = {}) {
    return this.database.saveReviewItem(contentKey, data);
  }

  listReviewItems() {
    return this.database.listReviewItems();
  }

  saveReviewTarget(contentKey: string, data: Partial<ReviewTarget> = {}) {
    return this.database.saveReviewTarget(contentKey, data);
  }

  listReviewTargets() {
    return this.database.listReviewTargets() as Promise<ReviewTargetRecord[]>;
  }

  async saveDiagnosis(diagnosis: DiagnosisRecord): Promise<void> {
    await this.database.saveDiagnosis(diagnosis as AttemptDiagnosis);
  }

  listDiagnoses() {
    return this.database.listDiagnoses();
  }

  saveDailyChallenge(contentKey: string, data: Record<string, unknown> = {}) {
    return this.database.saveDailyChallenge(contentKey, data);
  }

  listDailyChallenges() {
    return this.database.listDailyChallenges();
  }

  saveStreak(data: Record<string, unknown> = {}) {
    return this.database.saveStreak(data);
  }

  getStreak() {
    return this.database.getStreak();
  }

  saveAchievement(contentKey: string, data: Record<string, unknown> = {}) {
    return this.database.saveAchievement(contentKey, data);
  }

  listAchievements() {
    return this.database.listAchievements();
  }

  listTopicMastery() {
    return this.database.listTopicMastery();
  }

  exportProgress() {
    return this.database.exportProgress();
  }

  importProgress(snapshot: string) {
    return this.database.importProgress(snapshot);
  }

  saveTopicMastery(contentKey: string, data: Record<string, unknown> = {}) {
    return this.database.saveTopicMastery(contentKey, data);
  }
}
