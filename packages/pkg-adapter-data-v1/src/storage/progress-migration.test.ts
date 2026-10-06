import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it } from "vitest";
import { ProgressDatabase } from "./progress.database";

const databaseName = "saberes-progress-migration-test";

afterEach(async () => {
  await Dexie.delete(databaseName);
});

describe("migração do progresso local", () => {
  it("normaliza relações ao importar um backup antigo", async () => {
    const database = new ProgressDatabase(databaseName);

    try {
      await database.importProgress({
        snapshot: JSON.stringify({
          formatVersion: 1,
          exportedAt: "2026-10-05T10:00:00.000Z",
          stores: {
            settings: [{
              key: "personal-workspace",
              value: {
                activities: [{ id: "activity", contentKey: "topic:algebra", title: "Revisar" }],
                captures: [],
                checklists: [],
                notes: [{ id: "note", contentKey: "broken-key", title: "Nota", body: "Texto" }],
                references: [],
              },
            }],
            focusSessions: [{ id: "focus", contentKey: "lesson:one", startedAt: "2026-10-05T10:00:00.000Z" }],
          },
        }),
        strategy: "replace",
      });

      const workspace = await database.getPersonalWorkspace();

      expect(workspace.activities[0].contentReference)
        .toEqual({ type: "topic", id: "algebra" });

      expect(workspace.notes[0].contentReference)
        .toBeUndefined();

      await expect(database.listFocusSessions()).resolves.toEqual([
        expect.objectContaining({ id: "focus", contentReference: { type: "lesson", id: "one" } }),
      ]);
    }
    finally {
      database.close();
    }
  });

  it("preserva tentativas e converte itens de revisão da versão anterior", async () => {
    await Dexie.delete(databaseName);

    const legacyDatabase = new Dexie(databaseName);

    legacyDatabase.version(6)
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

    await legacyDatabase.open();

    await legacyDatabase.table("attempts")
      .put({
        id: "attempt-legacy",
        contentKey: "question:legacy",
        isCorrect: true,
      });

    await legacyDatabase.table("reviewItems")
      .put({
        contentKey: "question:legacy",
        dueAt: "2026-10-05T10:00:00.000Z",
        updatedAt: "2026-10-04T10:00:00.000Z",
      });

    await legacyDatabase.table("bookmarks")
      .put({
        contentKey: "lesson:legacy",
        updatedAt: "2026-10-04T10:00:00.000Z",
      });

    await legacyDatabase.table("planProgress")
      .put({
        contentKey: "plan:legacy",
        completed: false,
        updatedAt: "2026-10-04T10:00:00.000Z",
      });

    await legacyDatabase.table("streaks")
      .put({
        contentKey: "streak:legacy",
        lastDate: "2026-10-04",
      });

    await legacyDatabase.table("achievements")
      .put({
        contentKey: "achievement:legacy",
        unlockedAt: "2026-10-04T10:00:00.000Z",
      });

    await legacyDatabase.table("settings")
      .put({
        key: "personal-workspace",
        value: {
          activities: [{ id: "activity-valid", contentKey: "topic:algebra", title: "Revisar" }, { id: "activity-invalid", contentKey: "unknown:gone", title: "Preservar" }],
          captures: [],
          checklists: [{ id: "checklist-valid", contentKey: "lesson:one", title: "Plano", items: [] }],
          notes: [{ id: "note-valid", contentKey: "question:11", title: "Anotação", body: "Texto" }],
          references: [{ id: "reference-empty", title: "Fonte" }],
        },
      });

    await legacyDatabase.table("focusSessions")
      .put({ id: "focus-valid", contentKey: "lesson:one", status: "completed", startedAt: "2026-10-04T10:00:00.000Z", elapsedMs: 60000 });

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

      await expect(currentDatabase.table("streaks")
        .toArray()).resolves.toEqual([
        expect.objectContaining({ contentKey: "streak:legacy" }),
      ]);

      await expect(currentDatabase.listAchievements()).resolves.toEqual([
        expect.objectContaining({ contentKey: "achievement:legacy" }),
      ]);

      const personalWorkspace = await currentDatabase.getPersonalWorkspace();

      expect(personalWorkspace.activities)
        .toEqual([
          expect.objectContaining({ id: "activity-valid", contentReference: { type: "topic", id: "algebra" } }),
          expect.objectContaining({ id: "activity-invalid", title: "Preservar" }),
        ]);

      expect(personalWorkspace.activities[1].contentReference)
        .toBeUndefined();

      expect(personalWorkspace.checklists[0].contentReference)
        .toEqual({ type: "lesson", id: "one" });

      expect(personalWorkspace.notes[0].contentReference)
        .toEqual({ type: "question", id: "11" });

      expect(personalWorkspace.references[0].contentReference)
        .toBeUndefined();

      await expect(currentDatabase.listFocusSessions()).resolves.toEqual([
        expect.objectContaining({ id: "focus-valid", contentReference: { type: "lesson", id: "one" } }),
      ]);
    } finally {
      currentDatabase.close();
    }
  });
});
