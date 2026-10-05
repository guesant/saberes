import { describe, expect, it } from "vitest";
import { createPersonalRelationEndpoints } from "./create-personal-relation-endpoints.function";

describe("createPersonalRelationEndpoints", () => {
  it("creates typed endpoints from supported record types", () => {
    expect(createPersonalRelationEndpoints({
      sourceId: "note-1",
      sourceType: "note",
      targetId: "topic-1",
      targetType: "topic",
    }))
      .toEqual({
        source: { id: "note-1", recordType: "note" },
        target: { id: "topic-1", recordType: "topic" },
      });
  });

  it("rejects empty or unsupported endpoints", () => {
    expect(createPersonalRelationEndpoints({
      sourceId: "note-1",
      sourceType: "unsupported",
      targetId: "topic-1",
      targetType: "topic",
    }))
      .toBeNull();

    expect(createPersonalRelationEndpoints({
      sourceId: " ",
      sourceType: "note",
      targetId: "topic-1",
      targetType: "topic",
    }))
      .toBeNull();
  });
});
