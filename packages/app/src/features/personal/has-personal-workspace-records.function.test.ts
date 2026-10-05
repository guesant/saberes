import { describe, expect, it } from "vitest";
import { hasPersonalWorkspaceRecords } from "./has-personal-workspace-records.function";
import type { PersonalWorkspace } from "@guesant/saberes-application";

const emptyWorkspace: PersonalWorkspace = {
  activities: [],
  captures: [],
  checklists: [],
  notes: [],
  references: [],
};

describe("hasPersonalWorkspaceRecords", () => {
  it("returns false for a workspace without records", () => {
    expect(hasPersonalWorkspaceRecords(emptyWorkspace))
      .toBe(false);
  });

  it("keeps a workspace with only relations visible", () => {
    expect(hasPersonalWorkspaceRecords({
      ...emptyWorkspace,
      relations: [
        {
          archived: false,
          createdAt: "2026-10-05T10:00:00.000Z",
          id: "relation-1",
          kind: "anchor",
          source: { id: "note-1", recordType: "note" },
          target: { id: "topic-1", recordType: "topic" },
          updatedAt: "2026-10-05T10:00:00.000Z",
        },
      ],
    }))
      .toBe(true);
  });
});
