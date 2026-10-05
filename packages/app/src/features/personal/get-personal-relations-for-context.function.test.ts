import { describe, expect, it } from "vitest";
import { getPersonalRelationsForContext } from "./get-personal-relations-for-context.function";
import type { PersonalRelation } from "@guesant/saberes-application";

const relations: PersonalRelation[] = [
  {
    id: "relation-note-topic",
    kind: "anchor",
    source: { id: "note-1", recordType: "note" },
    target: { id: "topic-1", recordType: "topic" },
    archived: false,
    createdAt: "2026-10-05T00:00:00.000Z",
    updatedAt: "2026-10-05T00:00:00.000Z",
  },
  {
    id: "relation-reference-activity",
    kind: "supports",
    source: { id: "reference-1", recordType: "reference" },
    target: { id: "activity-1", recordType: "activity" },
    archived: false,
    createdAt: "2026-10-05T00:00:00.000Z",
    updatedAt: "2026-10-05T00:00:00.000Z",
  },
];

describe("getPersonalRelationsForContext", () => {
  it("keeps all relations for the all filter", () => {
    expect(getPersonalRelationsForContext(relations, "all"))
      .toEqual(relations);
  });

  it("matches either endpoint of the selected context", () => {
    expect(getPersonalRelationsForContext(relations, "topic"))
      .toHaveLength(1);

    expect(getPersonalRelationsForContext(relations, "reference"))
      .toHaveLength(1);

    expect(getPersonalRelationsForContext(relations, "capture"))
      .toEqual([]);
  });
});
