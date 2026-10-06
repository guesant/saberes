import {
  ReviewState as ReviewStateEnum,
  ReviewTargetType as ReviewTargetTypeEnum,
  type DiagnosisCode,
  type DiagnosisConfidence,
  type DiagnosisSource,
  type PedagogicalAction,
  type ReviewState,
  type AcademicDiscipline,
  type FocusSession,
  type PersonalReference,
  type StudyGoal,
  type PersonalWorkspace,
  type BackupRetentionPolicy,
  type LocalRecordTombstone,
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
import { createPersonalSearchIndexEntries } from "./create-personal-search-index-entries.function";
import { getProgressSnapshotChecksum } from "./get-progress-snapshot-checksum.function";
import { isPersonalSearchIndexEntries } from "./is-personal-search-index-entries.function";
import { isPersonalWorkspace } from "./is-personal-workspace.function";
import { updatePersonalSearchIndexEntries } from "./update-personal-search-index-entries.function";
import type { AttemptDiagnosis } from "./attempt-diagnosis.interface";
import type { AttemptWithId } from "./attempt-with-id.interface";
import type { Attempt } from "./attempt.type";
import type { PersonalSearchIndexEntry } from "./personal-search-index-entry.interface";
import type { ProgressBackupEvent } from "./progress-backup-event.interface";
import type { ProgressDatabaseContract } from "./progress-database.contract";
import type { ProgressSettingRecord } from "./progress-setting-record.interface";
import type { ReviewDatabaseEvent } from "./review-database-event.interface";
import type { ReviewEventInput } from "./review-event-input.interface";
import type { ReviewTarget } from "./review-target.interface";
import type { SessionRecord } from "./session-record.interface";
import type { CompleteSimulationSessionInput, UpdateSimulationSessionInput, StudySession , ImportProgressInput, SavedCatalogFilter } from "@guesant/saberes-application";

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
  "focusSessions",
  "academicDisciplines",
  "streaks",
  "achievements",
  "goals",
  "topicMastery",
  "savedCatalogFilters",
];

const progressStoreNames = [...studyStores, "attempts", "sessions", "settings", "tombstones"];

const personalWorkspaceSettingKey = "personal-workspace";

const personalWorkspaceIndexSettingKey = "personal-workspace-index";

const emptyPersonalWorkspace: PersonalWorkspace = {
  activities: [],
  notes: [],
  checklists: [],
  captures: [],
  references: [],
};

const ProgressBackupSchema = object({
  formatVersion: literal(1),
  exportedAt: string(),
  schemaVersion: optional(union([literal(1), literal(2)])),
  contentVersion: optional(string()),
  origin: optional(string()),
  checksum: optional(string()),
  stores: record(string(), array(looseObject({}))),
});

export class ProgressDatabase extends Dexie implements ProgressDatabaseContract {
  attempts!: Table<AttemptWithId>;

  sessions!: Table<SessionRecord, string>;

  settings!: Table<ProgressSettingRecord, string>;

  tombstones!: Table<LocalRecordTombstone, string>;

  diagnoses!: Table<AttemptDiagnosis, string>;

  reviewTargets!: Table<ReviewTarget, string>;

  reviewEvents!: Table<ReviewDatabaseEvent, string>;

  savedCatalogFilters!: Table<SavedCatalogFilter, string>;

  studyGoals!: Table<StudyGoal, string>;

  focusSessions!: Table<FocusSession, string>;

  academicDisciplines!: Table<AcademicDiscipline, string>;

  constructor(databaseName = "saberes-progress") {
    super(databaseName);

    this.version(5)
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
        savedCatalogFilters: "id, updatedAt",
      })
      .upgrade(async (tx) => {
        const legacyItems = await tx.table("reviewItems")
          .toArray();

        await Promise.all(
          legacyItems.map((item) => {
            return tx.table("reviewTargets")
              .put({
                ...item,
                contentKey: item.contentKey,
                targetType: item.targetType || ReviewTargetTypeEnum.Question,
                state: item.state || ReviewStateEnum.New,
                schedulerVersion: item.schedulerVersion || "legacy",
                updatedAt: item.updatedAt || this.nowIso(),
              });
          }),
        );
      });

    this.version(6)
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
        studyGoals: "contentKey, dueDate, dueAt, status, updatedAt",
        focusSessions: "id, startedAt, endedAt, status, contentKey",
        academicDisciplines: "id, updatedAt, name",
        streaks: "contentKey, lastDate",
        achievements: "contentKey, unlockedAt",
        goals: "contentKey, updatedAt",
        topicMastery: "contentKey, percentage, updatedAt",
        savedCatalogFilters: "id, updatedAt",
      });

    this.version(7)
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
        studyGoals: "contentKey, dueDate, dueAt, status, updatedAt",
        focusSessions: "id, startedAt, endedAt, status, contentKey",
        academicDisciplines: "id, updatedAt, name",
        streaks: "contentKey, lastDate",
        achievements: "contentKey, unlockedAt",
        goals: "contentKey, updatedAt",
        topicMastery: "contentKey, percentage, updatedAt",
        savedCatalogFilters: "id, updatedAt",
        backupEvents: "id, operation, result, createdAt",
      })
      .upgrade(async (tx) => {
        const legacyItems = await tx.table("reviewItems")
          .toArray();

        await Promise.all(
          legacyItems.map((item) => {
            return tx.table("reviewTargets")
              .put({
                ...item,
                contentKey: item.contentKey,
                targetType: item.targetType || ReviewTargetTypeEnum.Question,
                state: item.state || ReviewStateEnum.New,
                schedulerVersion: item.schedulerVersion || "legacy",
                updatedAt: item.updatedAt || this.nowIso(),
              });
          }),
        );
      });

    this.version(8)
      .stores({
        tombstones: "id, recordType, recordId, deletedAt",
      });
  }

  private nowIso() {
    return new Date()
      .toISOString();
  }

  private generatedId() {
    return (
      globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()
        .toString(16)
        .slice(2)}`
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

    await this.table(store)
      .put(value);

    return value;
  }

  private listStudy(store: string) {
    return this.table(store)
      .toArray();
  }

  async saveAttempt(attempt: Attempt) {
    const normalized = this.validated(AttemptSchema, {
      ...attempt,
      id: attempt.id || this.generatedId(),
      answeredAt: attempt.answeredAt || this.nowIso(),
    }) as AttemptWithId;

    await this.table("attempts")
      .put(normalized);

    return normalized;
  }

  listAttempts() {
    return this.table("attempts")
      .toArray() as Promise<AttemptWithId[]>;
  }

  async saveSession(session: SessionRecord): Promise<void> {
    await this.table("sessions")
      .put(session);
  }

  async updateSimulationSession(input: UpdateSimulationSessionInput): Promise<StudySession> {
    return this.transaction("rw", this.sessions, async () => {
      const session = await this.sessions.get(input.sessionId);

      if (!session || session.mode !== "simulation") {
        throw new Error("Simulado não encontrado.");
      }

      if (session.status === "completed") {
        return session;
      }

      const deadline = Date.parse(session.expiresAt || "");

      const updatedAt = Date.parse(input.updatedAt);

      if (!Number.isFinite(deadline) || !Number.isFinite(updatedAt) || updatedAt >= deadline) {
        throw new Error("O tempo do simulado terminou.");
      }

      const keys = session.questionKeys || [];

      if (input.questionKey && !keys.includes(input.questionKey)) {
        throw new Error("Questão não pertence ao simulado.");
      }

      if (input.answer !== undefined && !input.questionKey) {
        throw new Error("Escolha uma questão para salvar a resposta.");
      }

      if (input.currentIndex !== undefined && (!Number.isInteger(input.currentIndex) || input.currentIndex < 0 || input.currentIndex >= keys.length)) {
        throw new Error("Posição inválida no simulado.");
      }

      const answers = [...(session.simulationAnswers || [])];

      if (input.questionKey && input.answer !== undefined) {
        const index = answers.findIndex((answer) => { return answer.questionKey === input.questionKey; });

        const draft = { questionKey: input.questionKey, value: input.answer, answeredAt: input.updatedAt };

        if (index < 0) {
          answers.push(draft);
        } else {
          answers[index] = draft;
        }
      }

      let flags = session.flaggedQuestionKeys || [];

      if (input.toggleFlag && input.questionKey) {
        flags = flags.includes(input.questionKey)
          ? flags.filter((key) => { return key !== input.questionKey; })
          : [...flags, input.questionKey];
      }

      const next: StudySession = {
        ...session,
        revision: (session.revision || 0) + 1,
        simulationAnswers: answers,
        flaggedQuestionKeys: flags,
        currentIndex: input.currentIndex ?? session.currentIndex,
      };

      await this.sessions.put(next);

      return next;
    });
  }

  async completeSimulationSession(input: CompleteSimulationSessionInput): Promise<StudySession> {
    return this.transaction("rw", this.sessions, this.attempts, async () => {
      const current = await this.sessions.get(input.session.id);

      if (!current || current.mode !== "simulation") {
        throw new Error("Simulado não encontrado.");
      }

      if (current.status === "completed") {
        return current;
      }

      if ((current.revision || 0) !== input.expectedRevision) {
        throw new Error("As respostas foram atualizadas. Tente concluir novamente.");
      }

      const attempts = input.attempts.map((attempt) => {
        if (!attempt.id || attempt.sessionId !== current.id) {
          throw new Error("Tentativa inválida para este simulado.");
        }

        return { ...attempt, id: attempt.id };
      });

      await this.attempts.bulkPut(attempts);

      await this.sessions.put(input.session);

      return input.session;
    });
  }

  getSession(id: string) {
    return this.table("sessions")
      .get(id);
  }

  listSessions() {
    return this.table("sessions")
      .toArray();
  }

  listSavedCatalogFilters(): Promise<SavedCatalogFilter[]> {
    return this.savedCatalogFilters.orderBy("updatedAt")
      .reverse()
      .toArray();
  }

  async saveSavedCatalogFilter(filter: SavedCatalogFilter): Promise<void> {
    await this.savedCatalogFilters.put(filter);
  }

  async deleteSavedCatalogFilter(id: string): Promise<void> {
    await this.savedCatalogFilters.delete(id);
  }

  async saveSetting(key: string, value: unknown): Promise<void> {
    await this.table("settings")
      .put({ key, value });
  }

  getSetting(key: string) {
    return this.table("settings")
      .get(key);
  }

  async clearProgress() {
    await Promise.all(
      [...studyStores, "attempts", "sessions", "tombstones"].map((store) => {
        return this.table(store)
          .clear();
      }),
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

  async saveReviewEvent(event: ReviewEventInput): Promise<void> {
    await this.table("reviewEvents")
      .put({ ...event, id: event.id || this.generatedId() });
  }

  listReviewEvents(contentKey?: string) {
    return contentKey
      ? this.table("reviewEvents")
        .where("contentKey")
        .equals(contentKey)
        .toArray()
      : this.table("reviewEvents")
        .toArray();
  }

  listBackupEvents(): Promise<ProgressBackupEvent[]> {
    return this.table("backupEvents")
      .orderBy("createdAt")
      .reverse()
      .toArray();
  }

  async saveDiagnosis(diagnosis: AttemptDiagnosis): Promise<void> {
    await this.table("diagnoses")
      .put({
        ...diagnosis,
        createdAt: diagnosis.createdAt || this.nowIso(),
      });
  }

  listDiagnoses() {
    return this.table("diagnoses")
      .toArray();
  }

  saveDailyChallenge(contentKey: string, data: Record<string, unknown> = {}) {
    return this.putStudy("dailyChallenges", contentKey, data);
  }

  listDailyChallenges() {
    return this.listStudy("dailyChallenges");
  }

  listStudyGoals() {
    return this.studyGoals.toArray();
  }

  async getPersonalWorkspace(): Promise<PersonalWorkspace> {
    const setting = await this.getSetting(personalWorkspaceSettingKey);

    if (!isPersonalWorkspace(setting?.value)) {
      return emptyPersonalWorkspace;
    }

    return {
      ...setting.value,
      activities: Array.isArray(setting.value.activities) ? setting.value.activities : [],
      calendarEntries: Array.isArray(setting.value.calendarEntries)
        ? setting.value.calendarEntries
        : [],
      references: setting.value.references.map((reference: PersonalReference) => {
        return {
          ...reference,
          archived: reference.archived ?? false,
        };
      }),
    };
  }

  async savePersonalWorkspace(workspace: PersonalWorkspace): Promise<PersonalWorkspace> {
    const previousIndexSetting = await this.getSetting(personalWorkspaceIndexSettingKey);

    const previousIndex = isPersonalSearchIndexEntries(previousIndexSetting?.value)
      ? previousIndexSetting.value
      : [];

    const nextIndex = updatePersonalSearchIndexEntries(previousIndex, workspace);

    await this.transaction("rw", "settings", async () => {
      await this.table("settings")
        .bulkPut([
          { key: personalWorkspaceSettingKey, value: workspace },
          { key: personalWorkspaceIndexSettingKey, value: nextIndex },
        ]);
    });

    return workspace;
  }

  async listPersonalSearchIndex(): Promise<PersonalSearchIndexEntry[]> {
    const setting = await this.getSetting(personalWorkspaceIndexSettingKey);

    return isPersonalSearchIndexEntries(setting?.value) ? setting.value : [];
  }

  listTombstones(): Promise<LocalRecordTombstone[]> {
    return this.tombstones.orderBy("deletedAt")
      .reverse()
      .toArray();
  }

  async saveTombstone(tombstone: LocalRecordTombstone): Promise<void> {
    await this.tombstones.put(tombstone);
  }

  async applyBackupRetention(policy: BackupRetentionPolicy): Promise<void> {
    const events = await this.listBackupEvents();

    const cutoff = Date.parse(this.nowIso()) - Math.max(0, policy.maxAgeDays) * 24 * 60 * 60 * 1000;

    const retainedIds = new Set(
      events
        .filter((event) => { return Date.parse(event.createdAt) >= cutoff; })
        .slice(0, Math.max(0, policy.maxEvents))
        .map((event) => { return event.id; }),
    );

    const expiredIds = events
      .filter((event) => { return !retainedIds.has(event.id); })
      .map((event) => { return event.id; });

    if (expiredIds.length === 0) {
      return;
    }

    await this.table("backupEvents")
      .bulkDelete(expiredIds);
  }

  async rebuildPersonalSearchIndex(): Promise<PersonalSearchIndexEntry[]> {
    const workspace = await this.getPersonalWorkspace();

    const nextIndex = createPersonalSearchIndexEntries(workspace);

    await this.table("settings")
      .put({ key: personalWorkspaceIndexSettingKey, value: nextIndex });

    return nextIndex;
  }

  async saveStudyGoal(goal: StudyGoal): Promise<StudyGoal> {
    await this.studyGoals.put(goal);

    return goal;
  }

  listFocusSessions(): Promise<FocusSession[]> {
    return this.focusSessions.orderBy("startedAt")
      .reverse()
      .toArray();
  }

  async saveFocusSession(session: FocusSession): Promise<FocusSession> {
    await this.focusSessions.put(session);

    return session;
  }

  listAcademicDisciplines(): Promise<AcademicDiscipline[]> {
    return this.academicDisciplines.orderBy("name")
      .toArray();
  }

  async saveAcademicDiscipline(discipline: AcademicDiscipline): Promise<AcademicDiscipline> {
    await this.academicDisciplines.put(discipline);

    return discipline;
  }

  deleteAcademicDiscipline(id: string): Promise<void> {
    return this.academicDisciplines.delete(id);
  }

  saveStreak(data: Record<string, unknown> = {}) {
    return this.putStudy("streaks", "current", data);
  }

  async getStreak(): Promise<Record<string, unknown>> {
    const streak = await this.table("streaks")
      .get("current");

    return streak ?? {};
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
      progressStoreNames.map(async (storeName) => {
        return [storeName, await this.table(storeName)
          .toArray()];
      }),
    );

    const stores = Object.fromEntries(entries);

    const checksum = await getProgressSnapshotChecksum(stores);

    const snapshot = JSON.stringify({
      formatVersion: 1,
      exportedAt: this.nowIso(),
      schemaVersion: 2,
      contentVersion: "editorial-snapshot",
      origin: "local-device",
      checksum,
      stores,
    });

    await this.table("backupEvents")
      .put({
        id: this.generatedId(),
        operation: "export",
        result: "success",
        scope: progressStoreNames,
        checksum,
        schemaVersion: 2,
        contentVersion: "editorial-snapshot",
        createdAt: this.nowIso(),
      });

    return snapshot;
  }

  async importProgress(input: ImportProgressInput) {
    let parsed: string;

    try {
      parsed = JSON.parse(input.snapshot);
    } catch (error) {
      await this.recordBackupEvent({
        operation: "import",
        result: "rejected",
        scope: progressStoreNames,
        strategy: input.strategy,
        errorMessage: error instanceof Error ? error.message : "JSON inválido",
      });

      throw new Error("O arquivo de progresso possui um formato inválido.");
    }

    const validation = safeParse(ProgressBackupSchema, parsed);

    if (!validation.success) {
      await this.recordBackupEvent({
        operation: "import",
        result: "rejected",
        scope: progressStoreNames,
        strategy: input.strategy,
        errorMessage: "Formato inválido",
      });

      throw new Error("O arquivo de progresso possui um formato inválido.");
    }

    if (validation.output.checksum) {
      const checksum = await getProgressSnapshotChecksum(validation.output.stores);

      if (checksum !== validation.output.checksum) {
        await this.recordBackupEvent({
          operation: "import",
          result: "rejected",
          scope: progressStoreNames,
          strategy: input.strategy,
          checksum: validation.output.checksum,
          schemaVersion: validation.output.schemaVersion,
          contentVersion: validation.output.contentVersion,
          errorMessage: "Checksum inválido",
        });

        throw new Error("O arquivo de progresso foi alterado ou está corrompido.");
      }
    }

    try {
      await this.transaction("rw", [...progressStoreNames, "backupEvents"], async () => {
        if (input.strategy === "replace") {
          await Promise.all(
            progressStoreNames.map((storeName) => {
              return this.table(storeName)
                .clear();
            }),
          );
        }

        await Promise.all(
          Object.entries(validation.output.stores)
            .filter(([storeName]) => {
              return progressStoreNames.includes(storeName);
            })
            .map(([storeName, rows]) => {
              return Array.isArray(rows) ? this.table(storeName)
                .bulkPut(rows) : Promise.resolve();
            }),
        );

        await this.table("backupEvents")
          .put({
            id: this.generatedId(),
            operation: "import",
            result: "success",
            scope: progressStoreNames,
            strategy: input.strategy,
            checksum: validation.output.checksum,
            schemaVersion: validation.output.schemaVersion,
            contentVersion: validation.output.contentVersion,
            createdAt: this.nowIso(),
          });
      });

      await this.rebuildPersonalSearchIndex();
    } catch (error) {
      await this.recordBackupEvent({
        operation: "import",
        result: "rejected",
        scope: progressStoreNames,
        strategy: input.strategy,
        checksum: validation.output.checksum,
        schemaVersion: validation.output.schemaVersion,
        contentVersion: validation.output.contentVersion,
        errorMessage: error instanceof Error ? error.message : "Falha na restauração",
      });

      throw error;
    }
  }

  private async recordBackupEvent(
    event: Omit<ProgressBackupEvent, "id" | "createdAt">,
  ): Promise<void> {
    await this.table("backupEvents")
      .put({
        ...event,
        id: this.generatedId(),
        createdAt: this.nowIso(),
      });
  }
}
