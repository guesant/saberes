import { describe, expect, it } from "vitest";
import { createPersonalWorkspaceTestFixture } from "./create-personal-workspace-test-fixture.function";
import { deletePersonalNote } from "./delete-personal-note.function";
import { deletePersonalReference } from "./delete-personal-reference.function";
import { deleteStudyCapture } from "./delete-study-capture.function";
import { deleteStudyChecklist } from "./delete-study-checklist.function";
import { getOrderedStudyCaptures } from "./get-ordered-study-captures.function";
import { moveStudyChecklistItem } from "./move-study-checklist-item.function";
import { restorePersonalNote } from "./restore-personal-note.function";
import { restorePersonalReference } from "./restore-personal-reference.function";
import { restoreStudyCapture } from "./restore-study-capture.function";
import { restoreStudyChecklist } from "./restore-study-checklist.function";
import { updatePersonalWorkspaceTestFixture } from "./update-personal-workspace-test-fixture.function";
import type { PersonalWorkspace } from "@guesant/saberes-application";

const emptyWorkspace: PersonalWorkspace = {
  notes: [],
  checklists: [],
  captures: [],
  references: [],
};

describe("personal workspace creation", () => {
  it("adds private records without changing existing collections", () => {
    const result = createPersonalWorkspaceTestFixture();

    expect(result.notes)
      .toHaveLength(1);

    expect(result.checklists[0].items[0].completed)
      .toBe(false);

    expect(result.captures[0].completed)
      .toBe(false);

    expect(result.references[0].source)
      .toBe("https://example.com");

    expect(emptyWorkspace.notes)
      .toHaveLength(0);
  });
});

describe("personal workspace archive", () => {
  it("archives one private record without changing other collections", () => {
    const workspace = createPersonalWorkspaceTestFixture();

    const withoutNote = deletePersonalNote(workspace, "note-1");

    const withoutChecklist = deleteStudyChecklist(workspace, "checklist-1");

    const withoutCapture = deleteStudyCapture(workspace, "capture-1");

    const withoutReference = deletePersonalReference(workspace, "reference-1");

    expect(withoutNote.notes)
      .toHaveLength(1);

    expect(withoutNote.notes[0].archived)
      .toBe(true);

    expect(withoutNote.references)
      .toHaveLength(1);

    expect(withoutChecklist.checklists)
      .toHaveLength(1);

    expect(withoutChecklist.checklists[0].archived)
      .toBe(true);

    expect(withoutCapture.captures)
      .toHaveLength(1);

    expect(withoutCapture.captures[0].archived)
      .toBe(true);

    expect(withoutReference.references)
      .toHaveLength(1);

    expect(withoutReference.references[0].archived)
      .toBe(true);
  });
});

describe("personal workspace restore", () => {
  it("restores archived private records by stable id", () => {
    const workspace = createPersonalWorkspaceTestFixture();

    const archived = deletePersonalReference(
      deleteStudyCapture(
        deleteStudyChecklist(deletePersonalNote(workspace, "note-1"), "checklist-1"),
        "capture-1",
      ),
      "reference-1",
    );

    const restored = restorePersonalReference(
      restoreStudyCapture(
        restoreStudyChecklist(restorePersonalNote(archived, "note-1"), "checklist-1"),
        "capture-1",
      ),
      "reference-1",
    );

    expect(restored.notes[0].archived)
      .toBe(false);

    expect(restored.checklists[0].archived)
      .toBe(false);

    expect(restored.captures[0].archived)
      .toBe(false);

    expect(restored.references[0].archived)
      .toBe(false);
  });
});

describe("personal workspace updates", () => {
  it("updates personal records without changing their stable ids", () => {
    const updatedReference = updatePersonalWorkspaceTestFixture(
      createPersonalWorkspaceTestFixture(),
    );

    expect(updatedReference.notes[0].id)
      .toBe("note-1");

    expect(updatedReference.notes[0].title)
      .toBe("Novo título");

    expect(updatedReference.captures[0].description)
      .toBe("Nova descrição");

    expect(updatedReference.references[0].source)
      .toBe("https://example.org");
  });
});

describe("personal capture ordering", () => {
  it("orders pending captures by completion, deadline, priority and update time", () => {
    const workspace = createPersonalWorkspaceTestFixture();

    const ordered = getOrderedStudyCaptures([
      { ...workspace.captures[0], id: "low", priority: "low", dueDate: "2026-12-01" },
      { ...workspace.captures[0], id: "high", priority: "high", dueDate: "2026-10-05" },
      { ...workspace.captures[0], id: "completed", completed: true, dueDate: "2026-10-04" },
    ]);

    expect(ordered[0].id)
      .toBe("high");

    expect(ordered[1].id)
      .toBe("low");

    expect(ordered[2].id)
      .toBe("completed");
  });
});

describe("personal checklist ordering", () => {
  it("moves an item while preserving completion state", () => {
    const workspace = createPersonalWorkspaceTestFixture();

    const firstChecklist = workspace.checklists[0];

    const moved = moveStudyChecklistItem({
      checklistId: firstChecklist.id,
      direction: "down",
      itemId: firstChecklist.items[0].id,
      now: "2026-10-04T12:00:00.000Z",
      workspace,
    });

    expect(moved.checklists[0].items[0].id)
      .toBe(firstChecklist.items[1].id);

    expect(moved.checklists[0].items[1].id)
      .toBe(firstChecklist.items[0].id);

    expect(moved.checklists[0].items[0].completed)
      .toBe(false);

    expect(moved.checklists[0].items[1].completed)
      .toBe(false);

    expect(moved.checklists[0].items[0].position)
      .toBe(0);

    expect(moved.checklists[0].items[1].position)
      .toBe(1);
  });
});
