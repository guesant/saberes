import type { AttemptDiagnosis } from "./attempt-diagnosis.interface";
import type { Attempt } from "./attempt.type";
import type { ReviewTarget } from "./review-target.type";
import type { SessionRecord } from "./session-record.interface";
import type { AttemptRecord, DiagnosisRecord, ReviewTargetRecord } from "@guesant/saberes-domain";

export interface ProgressStorageContract {
  clear(): Promise<void>;

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

  listAttempts(): Promise<Array<AttemptRecord>>;

  listBookmarks(): Promise<Array<Record<string, unknown>>>;

  listDailyChallenges(): Promise<Array<Record<string, unknown>>>;

  listDiagnoses(): Promise<Array<AttemptDiagnosis>>;

  listEnrollments(): Promise<Array<Record<string, unknown>>>;

  listLessonProgress(): Promise<Array<Record<string, unknown>>>;

  listPlanProgress(): Promise<Array<Record<string, unknown>>>;

  listReviewItems(): Promise<Array<Record<string, unknown>>>;

  listReviewTargets(): Promise<Array<ReviewTargetRecord>>;

  listSessions(): Promise<Array<SessionRecord>>;

  listTopicMastery(): Promise<Array<Record<string, unknown>>>;

  recordAttempt(attempt: Attempt): Promise<AttemptRecord & { id: string }>;

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

  saveDiagnosis(diagnosis: DiagnosisRecord): Promise<void>;

  saveLessonProgress(
    contentKey: string,
    data?: Record<string, unknown>,
  ): Promise<Record<string, unknown>>;

  savePlanProgress(
    contentKey: string,
    data?: Record<string, unknown>,
  ): Promise<Record<string, unknown>>;

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
