import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it } from "vitest";
import { ProgressDatabase } from "./progress.database";
import type { PersonalWorkspace } from "@guesant/saberes-domain";

const databaseName = "saberes-progress-personal-reopen-test";

const workspace: PersonalWorkspace = {
  activities: [],
  captures: [
    {
      archived: false,
      completed: false,
      createdAt: "2026-10-05T10:00:00.000Z",
      description: "Revisar o conceito.",
      id: "capture-reopen",
      priority: "high",
      title: "Reabrir estudo",
      updatedAt: "2026-10-05T10:00:00.000Z",
    },
  ],
  checklists: [],
  notes: [],
  references: [],
};

afterEach(async () => {
  await Dexie.delete(databaseName);
});

describe("personal workspace reopening", () => {
  it("recovers a captured record after closing and reopening Dexie", async () => {
    const firstDatabase = new ProgressDatabase(databaseName);

    await firstDatabase.savePersonalWorkspace(workspace);

    firstDatabase.close();

    const reopenedDatabase = new ProgressDatabase(databaseName);

    try {
      await expect(reopenedDatabase.getPersonalWorkspace()).resolves.toMatchObject({
        captures: [
          expect.objectContaining({
            id: "capture-reopen",
            title: "Reabrir estudo",
          }),
        ],
      });
    } finally {
      reopenedDatabase.close();
    }
  });
});
