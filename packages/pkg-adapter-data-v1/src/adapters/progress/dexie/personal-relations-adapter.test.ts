import "fake-indexeddb/auto";
import { afterEach, describe, expect, it } from "vitest";
import Dexie from "dexie";
import { ProgressDatabase } from "../../../storage/progress.database";
import { ArchivePersonalRelationAdapter } from "./archive-personal-relation-adapter.adapter";
import { CreatePersonalRelationAdapter } from "./create-personal-relation-adapter.adapter";
import { DexieProgressStore } from "./dexie-progress.store";
import { ListPersonalRelationsAdapter } from "./list-personal-relations-adapter.adapter";
import { RestorePersonalRelationAdapter } from "./restore-personal-relation-adapter.adapter";
import type { PersonalWorkspace } from "@guesant/saberes-domain";

const databaseName = "saberes-personal-relations-adapter-test";

const emptyWorkspace: PersonalWorkspace = {
  activities: [],
  captures: [],
  checklists: [],
  notes: [],
  references: [],
};

afterEach(async () => {
  await Dexie.delete(databaseName);
});

describe("personal relation adapters", () => {
  it("persists, lists, archives and restores a typed relation", async () => {
    const database = new ProgressDatabase(databaseName);

    const store = new DexieProgressStore(database);

    const create = new CreatePersonalRelationAdapter(store);

    const list = new ListPersonalRelationsAdapter(store);

    const archive = new ArchivePersonalRelationAdapter(store);

    const restore = new RestorePersonalRelationAdapter(store);

    try {
      await store.savePersonalWorkspace(emptyWorkspace);

      await create.execute({
        id: "relation-adapter-1",
        kind: "supports",
        now: "2026-10-05T10:00:00.000Z",
        source: { id: "note-1", recordType: "note" },
        target: { id: "activity-1", recordType: "activity" },
      });

      await expect(list.execute({ recordId: "note-1" })).resolves.toEqual([
        expect.objectContaining({
          id: "relation-adapter-1",
          kind: "supports",
        }),
      ]);

      await archive.execute({
        id: "relation-adapter-1",
        now: "2026-10-06T10:00:00.000Z",
      });

      await expect(list.execute({ recordId: "note-1" })).resolves.toHaveLength(0);

      await expect(list.execute({ includeArchived: true, recordId: "note-1" }))
        .resolves.toHaveLength(1);

      await restore.execute({
        id: "relation-adapter-1",
        now: "2026-10-07T10:00:00.000Z",
      });

      await expect(list.execute({ recordId: "note-1" })).resolves.toHaveLength(1);
    } finally {
      database.close();
    }
  });
});
