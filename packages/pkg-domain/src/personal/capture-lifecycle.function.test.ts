import { describe, expect, it } from "vitest";
import { archiveStudyCapture } from "./archive-study-capture.function";
import { completeStudyCapture } from "./complete-study-capture.function";
import { postponeStudyCapture } from "./postpone-study-capture.function";
import { restoreStudyCapture } from "./restore-study-capture.function";
import { undoStudyCapture } from "./undo-study-capture.function";
import type { PersonalWorkspace } from "../models/personal-workspace.interface";

const baseWorkspace: PersonalWorkspace = {
  activities: [],
  captures: [
    {
      archived: false,
      completed: false,
      createdAt: "2026-10-05T10:00:00.000Z",
      description: "Revisar o conceito.",
      id: "capture-1",
      priority: "medium",
      title: "Revisão",
      updatedAt: "2026-10-05T10:00:00.000Z",
    },
  ],
  checklists: [],
  notes: [],
  references: [],
};

describe("capture lifecycle", () => {
  it("completes an active capture idempotently", () => {
    const workspace = baseWorkspace;

    const input = { id: "capture-1", now: "2026-10-05T12:00:00.000Z", workspace };

    const completed = completeStudyCapture(input);

    const repeated = completeStudyCapture({ ...input, workspace: completed });

    expect(completed.captures[0].completed)
      .toBe(true);

    expect(repeated.captures[0].completed)
      .toBe(true);
  });

  it("postpones a capture without completing it", () => {
    const workspace = baseWorkspace;

    const postponed = postponeStudyCapture({
      dueDate: "2026-10-06",
      id: "capture-1",
      now: "2026-10-05T12:00:00.000Z",
      workspace,
    });

    expect(postponed.captures[0].dueDate)
      .toBe("2026-10-06");

    expect(postponed.captures[0].completed)
      .toBe(false);
  });

  it("archives and restores a capture idempotently", () => {
    const workspace = baseWorkspace;

    const input = { id: "capture-1", now: "2026-10-05T12:00:00.000Z", workspace };

    const archived = archiveStudyCapture(input);

    const repeatedArchive = archiveStudyCapture({ ...input, workspace: archived });

    const restored = restoreStudyCapture({ ...input, workspace: repeatedArchive });

    const repeatedRestore = restoreStudyCapture({ ...input, workspace: restored });

    expect(repeatedArchive.captures[0].archived)
      .toBe(true);

    expect(repeatedRestore.captures[0].archived)
      .toBe(false);
  });

  it("restores the previous state when an action is undone", () => {
    const workspace = baseWorkspace;

    const postponed = postponeStudyCapture({
      dueDate: "2026-10-06",
      id: "capture-1",
      now: "2026-10-05T12:00:00.000Z",
      workspace,
    });

    const undone = undoStudyCapture({
      archived: false,
      completed: false,
      dueDate: undefined,
      id: "capture-1",
      now: "2026-10-05T12:05:00.000Z",
      workspace: postponed,
    });

    expect(undone.captures[0].dueDate)
      .toBeUndefined();

    expect(undone.captures[0].archived)
      .toBe(false);
  });
});
