import { describe, expect, it } from "vitest";
import { resolvePersonalRelation } from "./resolve-personal-relation.function";
import type { PersonalRelation } from "../models/personal-relation.interface";
import type { PersonalWorkspace } from "../models/personal-workspace.interface";

const workspace: PersonalWorkspace = {
  activities: [],
  captures: [],
  checklists: [],
  notes: [
    {
      archived: false,
      body: "Nota",
      createdAt: "2026-10-05T10:00:00.000Z",
      id: "note-1",
      title: "Nota",
      updatedAt: "2026-10-05T10:00:00.000Z",
    },
  ],
  references: [],
};

const relation: PersonalRelation = {
  archived: false,
  createdAt: "2026-10-05T10:00:00.000Z",
  id: "relation-1",
  kind: "anchor",
  source: { id: "note-1", recordType: "note" },
  target: { id: "topic-1", recordType: "topic" },
  updatedAt: "2026-10-05T10:00:00.000Z",
};

describe("resolvePersonalRelation", () => {
  it("reports an active relation when both endpoints are available", () => {
    const result = resolvePersonalRelation({
      availableRecordIds: ["topic-1"],
      relation,
      workspace,
    });

    expect(result.state)
      .toBe("active");

    expect(result.source.status)
      .toBe("available");

    expect(result.target.status)
      .toBe("available");
  });

  it("reports imported and missing endpoints explicitly", () => {
    const imported = resolvePersonalRelation({
      availableRecordIds: [],
      importedRecordIds: ["topic-1"],
      relation,
      workspace,
    });

    const missing = resolvePersonalRelation({
      availableRecordIds: [],
      relation,
      workspace,
    });

    expect(imported.state)
      .toBe("imported-target");

    expect(missing.state)
      .toBe("missing-target");
  });

  it("reports archived and invalid endpoints", () => {
    const archived = resolvePersonalRelation({
      availableRecordIds: ["topic-1"],
      relation: { ...relation, archived: true },
      workspace,
    });

    const invalid = resolvePersonalRelation({
      availableRecordIds: ["topic-1"],
      relation: {
        ...relation,
        source: { id: "", recordType: "note" },
      },
      workspace,
    });

    expect(archived.state)
      .toBe("archived");

    expect(invalid.state)
      .toBe("invalid-source");
  });
});
