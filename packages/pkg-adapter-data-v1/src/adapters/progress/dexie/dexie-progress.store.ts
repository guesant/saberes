import { progressDb } from "../../../storage/progress.database";
import type { AttemptDiagnosis } from "../../../storage/attempt-diagnosis.interface";
import type { Attempt } from "../../../storage/attempt.type";
import type { ReviewTarget } from "../../../storage/review-target.type";
import type { DiagnosisRecord, AttemptRecord, ReviewTargetRecord } from "@guesant/saberes-domain";

type SessionRecord = { id: string; [key: string]: unknown };

export class DexieProgressStore {
  listAttempts() {
    return progressDb.listAttempts() as Promise<AttemptRecord[]>;
  }

  saveAttempt(attempt: Attempt) {
    return progressDb.saveAttempt(attempt);
  }

  recordAttempt(attempt: Attempt) {
    return progressDb.saveAttempt(attempt);
  }

  saveSession(session: SessionRecord) {
    return progressDb.saveSession(session);
  }

  getSession(id: string) {
    return progressDb.getSession(id);
  }

  saveSetting(key: string, value: unknown) {
    return progressDb.saveSetting(key, value);
  }

  getSetting(key: string) {
    return progressDb.getSetting(key);
  }

  clear() {
    return progressDb.clearProgress();
  }

  enrollCourse(contentKey: string, data: Record<string, unknown> = {}) {
    return progressDb.enrollCourse(contentKey, data);
  }

  listEnrollments() {
    return progressDb.listEnrollments();
  }

  saveLessonProgress(contentKey: string, data: Record<string, unknown> = {}) {
    return progressDb.saveLessonProgress(contentKey, data);
  }

  listLessonProgress() {
    return progressDb.listLessonProgress();
  }

  savePlanProgress(contentKey: string, data: Record<string, unknown> = {}) {
    return progressDb.savePlanProgress(contentKey, data);
  }

  listPlanProgress() {
    return progressDb.listPlanProgress();
  }

  saveBookmark(contentKey: string, data: Record<string, unknown> = {}) {
    return progressDb.saveBookmark(contentKey, data);
  }

  listBookmarks() {
    return progressDb.listBookmarks();
  }

  saveReviewItem(contentKey: string, data: Record<string, unknown> = {}) {
    return progressDb.saveReviewItem(contentKey, data);
  }

  listReviewItems() {
    return progressDb.listReviewItems();
  }

  saveReviewTarget(contentKey: string, data: Partial<ReviewTarget> = {}) {
    return progressDb.saveReviewTarget(contentKey, data);
  }

  listReviewTargets() {
    return progressDb.listReviewTargets() as Promise<ReviewTargetRecord[]>;
  }

  saveDiagnosis(diagnosis: DiagnosisRecord) {
    return progressDb.saveDiagnosis(diagnosis as AttemptDiagnosis);
  }

  listDiagnoses() {
    return progressDb.listDiagnoses();
  }

  saveDailyChallenge(contentKey: string, data: Record<string, unknown> = {}) {
    return progressDb.saveDailyChallenge(contentKey, data);
  }

  listDailyChallenges() {
    return progressDb.listDailyChallenges();
  }

  saveStreak(data: Record<string, unknown> = {}) {
    return progressDb.saveStreak(data);
  }

  getStreak() {
    return progressDb.getStreak();
  }

  saveAchievement(contentKey: string, data: Record<string, unknown> = {}) {
    return progressDb.saveAchievement(contentKey, data);
  }

  listAchievements() {
    return progressDb.listAchievements();
  }

  listTopicMastery() {
    return progressDb.listTopicMastery();
  }
}
