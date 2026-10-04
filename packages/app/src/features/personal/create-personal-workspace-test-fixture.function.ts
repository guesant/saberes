import { addPersonalNote } from "./add-personal-note.function";
import { addPersonalReference } from "./add-personal-reference.function";
import { addStudyCapture } from "./add-study-capture.function";
import { addStudyChecklist } from "./add-study-checklist.function";
import type { PersonalWorkspace } from "@guesant/saberes-application";

const emptyWorkspace: PersonalWorkspace = {
  notes: [],
  checklists: [],
  captures: [],
  references: [],
};

const noteInput = {
  id: "note-1",
  title: "Revisar",
  body: "Retomar o tópico",
  now: "2026-10-04T00:00:00.000Z",
};

const checklistInput = {
  id: "checklist-1",
  itemIds: ["item-1", "item-2"],
  title: "Passos",
  items: ["Ler", "Resolver"],
  now: "2026-10-04T00:00:00.000Z",
};

const captureInput = {
  id: "capture-1",
  title: "Pendência",
  description: "Resolver depois",
  now: "2026-10-04T00:00:00.000Z",
};

const referenceInput = {
  id: "reference-1",
  title: "Fonte",
  source: "https://example.com",
  now: "2026-10-04T00:00:00.000Z",
};

export function createPersonalWorkspaceTestFixture(): PersonalWorkspace {
  const withNote = addPersonalNote({ workspace: emptyWorkspace, ...noteInput });

  const withChecklist = addStudyChecklist({ workspace: withNote, ...checklistInput });

  const withCapture = addStudyCapture({ workspace: withChecklist, ...captureInput });

  return addPersonalReference({ workspace: withCapture, ...referenceInput });
}
