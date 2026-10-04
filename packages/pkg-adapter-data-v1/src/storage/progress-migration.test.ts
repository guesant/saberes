import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it } from "vitest";
import { ProgressDatabase } from "./progress.database";

const databaseName = "saberes-progress-migration-test";

afterEach(async () => {
  await Dexie.delete(databaseName);
});

describe("migração do progresso local", () => {
  it("preserva tentativas e converte itens de revisão da versão anterior", async () => {
    await Dexie.delete(databaseName);

    const legacyDatabase = new Dexie(databaseName);

    legacyDatabase.version(6).stores({
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

    await legacyDatabase.open();

    await legacyDatabase.table("attempts").put({
      id: "attempt-legacy",
      contentKey: "question:legacy",
      isCorrect: true,
    });

    await legacyDatabase.table("reviewItems").put({
      contentKey: "question:legacy",
      dueAt: "2026-10-05T10:00:00.000Z",
      updatedAt: "2026-10-04T10:00:00.000Z",
    });

    await legacyDatabase.table("bookmarks").put({
      contentKey: "lesson:legacy",
      updatedAt: "2026-10-04T10:00:00.000Z",
    });

    await legacyDatabase.table("planProgress").put({
      contentKey: "plan:legacy",
      completed: false,
      updatedAt: "2026-10-04T10:00:00.000Z",
    });

    await legacyDatabase.table("streaks").put({
      contentKey: "streak:legacy",
      lastDate: "2026-10-04",
    });

    await legacyDatabase.table("achievements").put({
      contentKey: "achievement:legacy",
      unlockedAt: "2026-10-04T10:00:00.000Z",
    });

    legacyDatabase.close();

    const currentDatabase = new ProgressDatabase(databaseName);

    try {
      await expect(currentDatabase.listAttempts()).resolves.toEqual([
        expect.objectContaining({ id: "attempt-legacy" }),
      ]);

      await expect(currentDatabase.listReviewTargets()).resolves.toEqual([
        expect.objectContaining({
          contentKey: "question:legacy",
          schedulerVersion: "legacy",
          targetType: "question",
        }),
      ]);

      await expect(currentDatabase.listBookmarks()).resolves.toEqual([
        expect.objectContaining({ contentKey: "lesson:legacy" }),
      ]);

      await expect(currentDatabase.listPlanProgress()).resolves.toEqual([
        expect.objectContaining({ contentKey: "plan:legacy" }),
      ]);

      await expect(currentDatabase.table("streaks").toArray()).resolves.toEqual([
        expect.objectContaining({ contentKey: "streak:legacy" }),
      ]);

      await expect(currentDatabase.listAchievements()).resolves.toEqual([
        expect.objectContaining({ contentKey: "achievement:legacy" }),
      ]);
    } finally {
      currentDatabase.close();
    }
  });
});
