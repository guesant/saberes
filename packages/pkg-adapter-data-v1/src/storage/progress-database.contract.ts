import type { AttemptDiagnosis } from "./attempt-diagnosis.interface";
import type { Attempt } from "./attempt.type";
import type { ReviewDatabaseEvent } from "./review-database-event.interface";
import type { ReviewTarget } from "./review-target.type";
import type { SessionRecord } from "./session-record.interface";
import type { AttemptRecord, ReviewTargetRecord } from "@guesant/saberes-domain";

export interface ProgressDatabaseContract {
  clearProgress(): Promise<void>;

  enrollCourse(
    contentKey: string,
    data?: Record<string, unknown>,
  ): Promise<Record<string, unknown>>;

  exportProgress(): Promise<string>;

  getSession(id: string): Promise<SessionRecord | undefined>;

  getSetting(key: string): Promise<{ key: string; value: unknown } | undefined>;

  getStreak(): Promise<Record<string, unknown> | undefined>;

  importProgress(snapshot: string): Promise<void>;

  listAchievements(): Promise<Array<Record<string, unknown>>>;

  listAttempts(): Promise<Array<AttemptRecord & { id: string }>>;

  listBookmarks(): Promise<Array<Record<string, unknown>>>;

  listDailyChallenges(): Promise<Array<Record<string, unknown>>>;

  listDiagnoses(): Promise<Array<AttemptDiagnosis>>;

  listEnrollments(): Promise<Array<Record<string, unknown>>>;

  listLessonProgress(): Promise<Array<Record<string, unknown>>>;

  listPlanProgress(): Promise<Array<Record<string, unknown>>>;

  listReviewItems(): Promise<Array<Record<string, unknown>>>;

  listReviewTargets(): Promise<Array<ReviewTargetRecord>>;

  listTopicMastery(): Promise<Array<Record<string, unknown>>>;

  saveAchievement(
    contentKey: string,
    data?: Record<string, unknown>,
  ): Promise<Record<string, unknown>>;

  saveAttempt(attempt: Attempt): Promise<AttemptRecord & { id: string }>;

  saveBookmark(
    contentKey: string,
    data?: Record<string, unknown>,
  ): Promise<Record<string, unknown>>;

  saveDailyChallenge(
    contentKey: string,
    data?: Record<string, unknown>,
  ): Promise<Record<string, unknown>>;

  saveDiagnosis(diagnosis: AttemptDiagnosis): Promise<void>;

  saveLessonProgress(
    contentKey: string,
    data?: Record<string, unknown>,
  ): Promise<Record<string, unknown>>;

  savePlanProgress(
    contentKey: string,
    data?: Record<string, unknown>,
  ): Promise<Record<string, unknown>>;

  saveReviewEvent(event: Omit<ReviewDatabaseEvent, "id"> & { id?: string }): Promise<void>;

  saveReviewItem(
    contentKey: string,
    data?: Record<string, unknown>,
  ): Promise<Record<string, unknown>>;

  saveReviewTarget(contentKey: string, data?: Partial<ReviewTarget>): Promise<ReviewTarget>;

  saveSession(session: SessionRecord): Promise<void>;

  saveSetting(key: string, value: unknown): Promise<void>;

  saveStreak(data?: Record<string, unknown>): Promise<Record<string, unknown>>;

  saveTopicMastery(
    contentKey: string,
    data?: Record<string, unknown>,
  ): Promise<Record<string, unknown>>;
}
