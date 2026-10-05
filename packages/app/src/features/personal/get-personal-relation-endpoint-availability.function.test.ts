import { describe, expect, it } from "vitest";
import { getPersonalRelationEndpointAvailability } from "./get-personal-relation-endpoint-availability.function";
import type { PersonalWorkspace } from "@guesant/saberes-application";

const workspace: PersonalWorkspace = {
  activities: [
    {
      id: "activity-1",
      status: "planned",
      title: "Atividade",
      description: "",
      createdAt: "2026-10-05T00:00:00.000Z",
      updatedAt: "2026-10-05T00:00:00.000Z",
    },
  ],
  checklists: [],
  captures: [],
  notes: [],
  references: [],
};

describe("getPersonalRelationEndpointAvailability", () => {
  it("distinguishes local, external and missing endpoints", () => {
    expect(getPersonalRelationEndpointAvailability(workspace, { id: "activity-1", recordType: "activity" }))
      .toBe("available");

    expect(getPersonalRelationEndpointAvailability(workspace, { id: "topic-1", recordType: "topic" }))
      .toBe("external");

    expect(getPersonalRelationEndpointAvailability(workspace, { id: "note-1", recordType: "note" }))
      .toBe("missing");
  });
});
