import { describe, expect, it } from "vitest";
import { listPersonalBacklinks } from "./list-personal-backlinks.function";
import type { PersonalWorkspace } from "../models/personal-workspace.interface";

const workspace: PersonalWorkspace = {
  activities: [],
  captures: [],
  checklists: [],
  notes: [],
  references: [],
  relations: [
    {
      archived: false,
      createdAt: "2026-10-05T10:00:00.000Z",
      id: "backlink-active",
      kind: "backlink",
      source: { id: "note-1", recordType: "note" },
      target: { id: "topic-1", recordType: "topic" },
      updatedAt: "2026-10-05T10:00:00.000Z",
    },
    {
      archived: false,
      createdAt: "2026-10-05T10:00:00.000Z",
      id: "backlink-other-target",
      kind: "backlink",
      source: { id: "note-2", recordType: "note" },
      target: { id: "topic-2", recordType: "topic" },
      updatedAt: "2026-10-05T10:00:00.000Z",
    },
    {
      archived: false,
      createdAt: "2026-10-05T10:00:00.000Z",
      id: "anchor-active",
      kind: "anchor",
      source: { id: "note-3", recordType: "note" },
      target: { id: "topic-1", recordType: "topic" },
      updatedAt: "2026-10-05T10:00:00.000Z",
    },
    {
      archived: true,
      createdAt: "2026-10-05T10:00:00.000Z",
      id: "backlink-archived",
      kind: "backlink",
      source: { id: "note-4", recordType: "note" },
      target: { id: "topic-1", recordType: "topic" },
      updatedAt: "2026-10-05T10:00:00.000Z",
    },
  ],
};

describe("listPersonalBacklinks", () => {
  it("returns active incoming backlinks for a target endpoint", () => {
    expect(listPersonalBacklinks({
      recordId: "topic-1",
      recordType: "topic",
      workspace,
    })
      .map((relation) => { return relation.id; }))
      .toEqual(["backlink-active"]);
  });

  it("returns every active backlink when no target filter is provided", () => {
    expect(listPersonalBacklinks({ workspace })
      .map((relation) => { return relation.id; }))
      .toEqual(["backlink-active", "backlink-other-target"]);
  });
});
