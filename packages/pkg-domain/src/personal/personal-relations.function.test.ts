import { describe, expect, it } from "vitest";
import { archivePersonalRelation } from "./archive-personal-relation.function";
import { createPersonalRelation } from "./create-personal-relation.function";
import { listPersonalRelations } from "./list-personal-relations.function";
import { restorePersonalRelation } from "./restore-personal-relation.function";
import type { CreatePersonalRelationInput } from "./create-personal-relation-input.interface";
import type { PersonalWorkspace } from "../models/personal-workspace.interface";

const workspace: PersonalWorkspace = {
  activities: [],
  captures: [],
  checklists: [],
  notes: [],
  references: [],
};

const relationInput: CreatePersonalRelationInput = {
  id: "relation-1",
  kind: "anchor",
  now: "2026-10-05T10:00:00.000Z",
  source: { id: "note-1", recordType: "note" },
  target: { id: "topic-1", recordType: "topic" },
  workspace,
};

describe("personal relations", () => {
  it("creates an idempotent typed relation", () => {
    const created = createPersonalRelation(relationInput);

    const repeated = createPersonalRelation({ ...relationInput, workspace: created });

    expect(created.relations)
      .toHaveLength(1);

    expect(repeated.relations)
      .toHaveLength(1);

    expect(listPersonalRelations({
      recordId: "topic-1",
      recordType: "topic",
      workspace: created,
    }))
      .toHaveLength(1);
  });

  it("archives and restores a relation without changing its identity", () => {
    const created = createPersonalRelation(relationInput);

    const archived = archivePersonalRelation({
      id: "relation-1",
      now: "2026-10-06T10:00:00.000Z",
      workspace: created,
    });

    expect(listPersonalRelations({ workspace: archived }))
      .toHaveLength(0);

    const restored = restorePersonalRelation({
      id: "relation-1",
      now: "2026-10-07T10:00:00.000Z",
      workspace: archived,
    });

    expect(listPersonalRelations({ workspace: restored })[0].id)
      .toBe("relation-1");
  });
});
