import "fake-indexeddb/auto";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { ProgressDatabase } from "./progress.database";

const progressDb = new ProgressDatabase("saberes-progress-recovery-model-test");

beforeEach(async () => {
  await progressDb.clearProgress();

  await progressDb.table("backupEvents")
    .clear();
});

afterAll(() => {
  progressDb.close();
});

describe("modelo local de recuperação", () => {
  it("preserva tombstones locais recuperáveis", async () => {
    await progressDb.saveTombstone({
      deletedAt: "2026-10-05T10:00:00.000Z",
      id: "tombstone-note-1",
      reason: "deleted",
      recordId: "note-1",
      recordType: "personal-note",
      schemaVersion: 8,
    });

    await expect(progressDb.listTombstones()).resolves.toEqual([
      {
        deletedAt: "2026-10-05T10:00:00.000Z",
        id: "tombstone-note-1",
        reason: "deleted",
        recordId: "note-1",
        recordType: "personal-note",
        schemaVersion: 8,
      },
    ]);
  });

  it("retém somente os eventos de backup dentro da política local", async () => {
    await progressDb.exportProgress();

    await progressDb.exportProgress();

    await progressDb.exportProgress();

    await progressDb.applyBackupRetention({
      maxAgeDays: 30,
      maxEvents: 2,
    });

    await expect(progressDb.listBackupEvents()).resolves.toHaveLength(2);
  });
});
