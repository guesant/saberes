import "fake-indexeddb/auto";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { ProgressDatabase } from "./progress.database";
import type { PersonalWorkspace } from "@guesant/saberes-domain";

const progressDb = new ProgressDatabase("saberes-progress-search-index-test");

const emptyWorkspace: PersonalWorkspace = {
  activities: [],
  captures: [],
  checklists: [],
  notes: [],
  references: [],
};

const workspace: PersonalWorkspace = {
  ...emptyWorkspace,
  notes: [
    {
      archived: false,
      body: "Revisar a definição",
      createdAt: "2026-10-01T10:00:00.000Z",
      id: "note-1",
      title: "Revisão local",
      updatedAt: "2026-10-01T10:00:00.000Z",
    },
  ],
};

beforeEach(async () => {
  await progressDb.savePersonalWorkspace(emptyWorkspace);
});

afterAll(() => {
  progressDb.close();
});

describe("personal search index", () => {
  it("persists a local index together with the workspace", async () => {
    await progressDb.savePersonalWorkspace(workspace);

    await expect(progressDb.listPersonalSearchIndex()).resolves.toEqual([
      {
        id: "note:note-1",
        recordId: "note-1",
        recordType: "note",
        searchText: "Revisão local Revisar a definição ",
        updatedAt: "2026-10-01T10:00:00.000Z",
      },
    ]);
  });

  it("removes an indexed record when it leaves the workspace", async () => {
    await progressDb.savePersonalWorkspace(workspace);

    await progressDb.savePersonalWorkspace(emptyWorkspace);

    await expect(progressDb.listPersonalSearchIndex()).resolves.toEqual([]);
  });

  it("rebuilds the index after the stored read model is lost", async () => {
    await progressDb.savePersonalWorkspace(workspace);

    await progressDb.saveSetting("personal-workspace-index", []);

    await expect(progressDb.rebuildPersonalSearchIndex()).resolves.toEqual([
      {
        id: "note:note-1",
        recordId: "note-1",
        recordType: "note",
        searchText: "Revisão local Revisar a definição ",
        updatedAt: "2026-10-01T10:00:00.000Z",
      },
    ]);

    await expect(progressDb.listPersonalSearchIndex()).resolves.toHaveLength(1);
  });

  it("rebuilds the index during progress restoration", async () => {
    await progressDb.savePersonalWorkspace(workspace);

    await progressDb.saveSetting("personal-workspace-index", []);

    const snapshot = await progressDb.exportProgress();

    await progressDb.savePersonalWorkspace(emptyWorkspace);

    await progressDb.importProgress({ snapshot, strategy: "replace" });

    await expect(progressDb.listPersonalSearchIndex()).resolves.toEqual([
      {
        id: "note:note-1",
        recordId: "note-1",
        recordType: "note",
        searchText: "Revisão local Revisar a definição ",
        updatedAt: "2026-10-01T10:00:00.000Z",
      },
    ]);
  });
});
