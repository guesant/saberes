import {
  ReviewState as ReviewStateEnum,
  ReviewTargetType as ReviewTargetTypeEnum,
  type DiagnosisCode,
  type DiagnosisConfidence,
  type DiagnosisSource,
  type PedagogicalAction,
  type ReviewState,
} from "@guesant/saberes-domain";
import { AttemptConfidence as AttemptConfidenceEnum } from "@guesant/saberes-domain";
import Dexie, { type Table } from "dexie";
import {
  type BaseIssue,
  type BaseSchema,
  boolean,
  array,
  literal,
  looseObject,
  nullable,
  object,
  optional,
  pipe,
  record,
  regex,
  safeParse,
  string,
  union,
} from "valibot";
import type { AttemptDiagnosis } from "./attempt-diagnosis.interface";
import type { Attempt } from "./attempt.type";
import type { ProgressDatabaseContract } from "./progress-database.contract";
import type { ReviewDatabaseEvent } from "./review-database-event.interface";
import type { ReviewTarget } from "./review-target.type";
import type { SessionRecord } from "./session-record.interface";

export type { DiagnosisCode, DiagnosisConfidence, DiagnosisSource, PedagogicalAction, ReviewState };

const ContentKeySchema = pipe(
  string(),
  regex(/^(course|lesson|topic|question|plan|assessment|achievement|daily):/),
);

const AttemptSchema = looseObject({
  id: optional(string()),
  contentKey: optional(ContentKeySchema),
  isCorrect: optional(nullable(boolean())),
  answeredAt: optional(string()),
  confidence: optional(
    union([
      literal(AttemptConfidenceEnum.Confident),
      literal(AttemptConfidenceEnum.Doubt),
      literal(AttemptConfidenceEnum.Guess),
    ]),
  ),
});

const studyStores = [
  "enrollments",
  "courseProgress",
  "moduleProgress",
  "lessonProgress",
  "planProgress",
  "bookmarks",
  "reviewItems",
  "reviewTargets",
  "reviewEvents",
  "diagnoses",
  "dailyChallenges",
  "studyGoals",
  "streaks",
  "achievements",
  "goals",
  "topicMastery",
];

const progressStoreNames = [...studyStores, "attempts", "sessions", "settings"];

const ProgressBackupSchema = object({
  formatVersion: literal(1),
  exportedAt: string(),
  stores: record(string(), array(looseObject({}))),
});

export class ProgressDatabase extends Dexie implements ProgressDatabaseContract {
  attempts!: Table<Attempt & { id: string }>;

  sessions!: Table<SessionRecord, string>;

  settings!: Table<{ key: string; value: unknown }, string>;

  diagnoses!: Table<AttemptDiagnosis, string>;

  reviewTargets!: Table<ReviewTarget, string>;

  reviewEvents!: Table<ReviewDatabaseEvent, string>;

  constructor() {
    super("saberes-progress");

    this.version(4)
      .stores({
        attempts: "id, answeredAt, sessionId, contentKey",
        sessions: "id, startedAt, completedAt",
        settings: "key",
        enrollments: "contentKey, startedAt",
        lessonProgress: "contentKey, completed, updatedAt",
        courseProgress: "contentKey, completed, updatedAt",
        moduleProgress: "contentKey, completed, updatedAt",
        planProgress: "contentKey, completed, updatedAt",
        bookmarks: "contentKey, updatedAt",
        reviewItems: "contentKey, dueAt, updatedAt",
        reviewTargets: "contentKey, dueAt, targetType, suspended, updatedAt",
        reviewEvents: "id, contentKey, reviewedAt",
        diagnoses: "attemptId, code, createdAt",
        dailyChallenges: "contentKey, date",
        studyGoals: "contentKey, dueDate",
        streaks: "contentKey, lastDate",
        achievements: "contentKey, unlockedAt",
        goals: "contentKey, updatedAt",
        topicMastery: "contentKey, percentage, updatedAt",
      })
      .upgrade(async (tx) => {
        const legacyItems = await tx.table("reviewItems").toArray();

        await Promise.all(
          legacyItems.map((item) =>
            tx.table("reviewTargets").put({
              ...item,
              contentKey: item.contentKey,
              targetType: item.targetType || ReviewTargetTypeEnum.Question,
              state: item.state || ReviewStateEnum.New,
              schedulerVersion: item.schedulerVersion || "legacy",
              updatedAt: item.updatedAt || this.nowIso(),
            }),
          ),
        );
      });
  }

  private nowIso() {
    return new Date().toISOString();
  }

  private generatedId() {
    return (
      globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`
    );
  }

  private validated<T extends object>(
    schema: BaseSchema<unknown, T, BaseIssue<unknown>>,
    value: T,
  ) {
    const result = safeParse(schema, value);

    return result.success ? result.output : value;
  }

  private async putStudy(store: string, contentKey: string, data: Record<string, unknown> = {}) {
    const value = { ...data, contentKey, updatedAt: this.nowIso() };

    await this.table(store).put(value);

    return value;
  }

  private listStudy(store: string) {
    return this.table(store).toArray();
  }

  async saveAttempt(attempt: Attempt) {
    const normalized = this.validated(AttemptSchema, {
      ...attempt,
      id: attempt.id || this.generatedId(),
      answeredAt: attempt.answeredAt || this.nowIso(),
    }) as Attempt & { id: string };

    await this.table("attempts").put(normalized);

    return normalized;
  }

  listAttempts() {
    return this.table("attempts").toArray() as Promise<Array<Attempt & { id: string }>>;
  }

  async saveSession(session: SessionRecord): Promise<void> {
    await this.table("sessions").put(session);
  }

  getSession(id: string) {
    return this.table("sessions").get(id);
  }

  listSessions() {
    return this.table("sessions").toArray();
  }

  async saveSetting(key: string, value: unknown): Promise<void> {
    await this.table("settings").put({ key, value });
  }

  getSetting(key: string) {
    return this.table("settings").get(key);
  }

  async clearProgress() {
    await Promise.all(
      [...studyStores, "attempts", "sessions"].map((store) => this.table(store).clear()),
    );
  }

  enrollCourse(contentKey: string, data: Record<string, unknown> = {}) {
    return this.putStudy("enrollments", contentKey, {
      ...data,
      startedAt: data.startedAt || this.nowIso(),
    });
  }

  listEnrollments() {
    return this.listStudy("enrollments");
  }

  saveLessonProgress(contentKey: string, data: Record<string, unknown> = {}) {
    return this.putStudy("lessonProgress", contentKey, data);
  }

  listLessonProgress() {
    return this.listStudy("lessonProgress");
  }

  saveCourseProgress(contentKey: string, data: Record<string, unknown> = {}) {
    return this.putStudy("courseProgress", contentKey, data);
  }

  listCourseProgress() {
    return this.listStudy("courseProgress");
  }

  saveModuleProgress(contentKey: string, data: Record<string, unknown> = {}) {
    return this.putStudy("moduleProgress", contentKey, data);
  }

  listModuleProgress() {
    return this.listStudy("moduleProgress");
  }

  savePlanProgress(contentKey: string, data: Record<string, unknown> = {}) {
    return this.putStudy("planProgress", contentKey, data);
  }

  listPlanProgress() {
    return this.listStudy("planProgress");
  }

  saveBookmark(contentKey: string, data: Record<string, unknown> = {}) {
    return this.putStudy("bookmarks", contentKey, data);
  }

  listBookmarks() {
    return this.listStudy("bookmarks");
  }

  async saveReviewItem(contentKey: string, data: Record<string, unknown> = {}) {
    const value = await this.putStudy("reviewItems", contentKey, data);

    await this.putStudy("reviewTargets", contentKey, {
      ...data,
      targetType: data.targetType || ReviewTargetTypeEnum.Question,
      state: data.state || ReviewStateEnum.New,
    });

    return value;
  }

  async saveReviewTarget(
    contentKey: string,
    data: Partial<ReviewTarget> = {},
  ): Promise<ReviewTarget> {
    const value = await this.putStudy("reviewTargets", contentKey, data);

    return { ...value, contentKey };
  }

  listReviewItems() {
    return this.listStudy("reviewItems");
  }

  listReviewTargets() {
    return this.listStudy("reviewTargets");
  }

  async saveReviewEvent(event: Omit<ReviewDatabaseEvent, "id"> & { id?: string }): Promise<void> {
    await this.table("reviewEvents").put({ ...event, id: event.id || this.generatedId() });
  }

  listReviewEvents(contentKey?: string) {
    return contentKey
      ? this.table("reviewEvents").where("contentKey").equals(contentKey).toArray()
      : this.table("reviewEvents").toArray();
  }

  async saveDiagnosis(diagnosis: AttemptDiagnosis): Promise<void> {
    await this.table("diagnoses").put({
      ...diagnosis,
      createdAt: diagnosis.createdAt || this.nowIso(),
    });
  }

  listDiagnoses() {
    return this.table("diagnoses").toArray();
  }

  saveDailyChallenge(contentKey: string, data: Record<string, unknown> = {}) {
    return this.putStudy("dailyChallenges", contentKey, data);
  }

  listDailyChallenges() {
    return this.listStudy("dailyChallenges");
  }

  saveStudyGoal(contentKey: string, data: Record<string, unknown> = {}) {
    return this.putStudy("studyGoals", contentKey, data);
  }

  listStudyGoals() {
    return this.listStudy("studyGoals");
  }

  saveStreak(data: Record<string, unknown> = {}) {
    return this.putStudy("streaks", "current", data);
  }

  getStreak() {
    return this.table("streaks").get("current");
  }

  saveAchievement(contentKey: string, data: Record<string, unknown> = {}) {
    return this.putStudy("achievements", contentKey, data);
  }

  listAchievements() {
    return this.listStudy("achievements");
  }

  saveTopicMastery(contentKey: string, data: Record<string, unknown> = {}) {
    return this.putStudy("topicMastery", contentKey, data);
  }

  listTopicMastery() {
    return this.listStudy("topicMastery");
  }

  async exportProgress() {
    const entries = await Promise.all(
      progressStoreNames.map(async (storeName) => [
        storeName,
        await this.table(storeName).toArray(),
      ]),
    );

    return JSON.stringify({
      formatVersion: 1,
      exportedAt: this.nowIso(),
      stores: Object.fromEntries(entries),
    });
  }

  async importProgress(snapshot: string) {
    const parsed = JSON.parse(snapshot);

    const validation = safeParse(ProgressBackupSchema, parsed);

    if (!validation.success) {
      throw new Error("O arquivo de progresso possui um formato inválido.");
    }

    await this.transaction("rw", progressStoreNames, async () => {
      await Promise.all(progressStoreNames.map((storeName) => this.table(storeName).clear()));

      await Promise.all(
        Object.entries(validation.output.stores)
          .filter(([storeName]) => progressStoreNames.includes(storeName))
          .map(([storeName, rows]) =>
            Array.isArray(rows) ? this.table(storeName).bulkPut(rows) : Promise.resolve(),
          ),
      );
    });
  }
}
