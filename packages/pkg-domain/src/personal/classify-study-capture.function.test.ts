import { describe, expect, it } from "vitest";
import { classifyStudyCapture } from "./classify-study-capture.function";
import type { PersonalWorkspace } from "../models/personal-workspace.interface";

const workspace: PersonalWorkspace = {
  activities: [],
  notes: [],
  checklists: [],
  captures: [
    {
      id: "capture-1",
      title: "Revisar conceito",
      description: "Retomar depois do exercício",
      contentKey: "topic:algebra",
      dueDate: "2026-10-06",
      priority: "medium",
      completed: false,
      archived: false,
      createdAt: "2026-10-05T12:00:00.000Z",
      updatedAt: "2026-10-05T12:00:00.000Z",
    },
  ],
  references: [],
};

describe("classifyStudyCapture", () => {
  it("promotes a capture to a note and archives the inbox source", () => {
    const result = classifyStudyCapture({
      workspace,
      captureId: "capture-1",
      targetId: "note-1",
      targetType: "note",
      now: "2026-10-05T12:10:00.000Z",
    });

    expect(result.notes[0])
      .toMatchObject({
        id: "note-1",
        sourceCaptureId: "capture-1",
        title: "Revisar conceito",
        body: "Retomar depois do exercício",
        contentKey: "topic:algebra",
      });

    expect(result.captures[0].archived)
      .toBe(true);

    expect(result.activities)
      .toEqual([]);
  });

  it("promotes a capture to a planned activity with its due date", () => {
    const result = classifyStudyCapture({
      workspace,
      captureId: "capture-1",
      targetId: "activity-1",
      targetType: "activity",
      now: "2026-10-05T12:10:00.000Z",
    });

    expect(result.activities[0])
      .toMatchObject({
        id: "activity-1",
        sourceCaptureId: "capture-1",
        title: "Revisar conceito",
        description: "Retomar depois do exercício",
        contentKey: "topic:algebra",
        dueDate: "2026-10-06",
        status: "planned",
      });
  });

  it("is idempotent for the same target and rejects another target type", () => {
    const classified = classifyStudyCapture({
      workspace,
      captureId: "capture-1",
      targetId: "note-1",
      targetType: "note",
      now: "2026-10-05T12:10:00.000Z",
    });

    expect(
      classifyStudyCapture({
        workspace: classified,
        captureId: "capture-1",
        targetId: "note-1",
        targetType: "note",
        now: "2026-10-05T12:20:00.000Z",
      }),
    )
      .toBe(classified);

    expect(() => {
      return classifyStudyCapture({
        workspace: classified,
        captureId: "capture-1",
        targetId: "activity-1",
        targetType: "activity",
        now: "2026-10-05T12:20:00.000Z",
      });
    })
      .toThrow("Study capture already classified: capture-1");
  });
});
