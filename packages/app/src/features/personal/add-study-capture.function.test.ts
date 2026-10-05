import { describe, expect, it } from "vitest";
import { addStudyCapture } from "./add-study-capture.function";
import type { PersonalWorkspace } from "@guesant/saberes-application";

const emptyWorkspace: PersonalWorkspace = {
  activities: [],
  notes: [],
  checklists: [],
  captures: [],
  references: [],
};

describe("addStudyCapture", () => {
  it("creates a pending capture while preserving the local workspace", () => {
    const result = addStudyCapture({
      workspace: emptyWorkspace,
      id: "capture-1",
      title: "Revisar conceito",
      description: "Retomar depois do exercício",
      contentKey: "topic:algebra",
      dueDate: "2026-10-06",
      now: "2026-10-05T12:00:00.000Z",
    });

    expect(result.captures)
      .toHaveLength(1);

    expect(result.captures[0])
      .toMatchObject({
        id: "capture-1",
        title: "Revisar conceito",
        description: "Retomar depois do exercício",
        contentKey: "topic:algebra",
        dueDate: "2026-10-06",
        completed: false,
        archived: false,
        createdAt: "2026-10-05T12:00:00.000Z",
        updatedAt: "2026-10-05T12:00:00.000Z",
      });

    expect(result.notes)
      .toEqual([]);

    expect(result.checklists)
      .toEqual([]);

    expect(emptyWorkspace.captures)
      .toEqual([]);
  });
});
