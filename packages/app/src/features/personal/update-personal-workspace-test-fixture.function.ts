import { updatePersonalNoteContent } from "./update-personal-note-content.function";
import { updatePersonalReferenceContent } from "./update-personal-reference-content.function";
import { updateStudyCaptureContent } from "./update-study-capture-content.function";
import type { PersonalWorkspace } from "@guesant/saberes-application";

export function updatePersonalWorkspaceTestFixture(
  workspace: PersonalWorkspace,
): PersonalWorkspace {
  const updatedNote = updatePersonalNoteContent({
    body: "Novo texto",
    id: "note-1",
    title: "Novo título",
    workspace,
  });

  const updatedCapture = updateStudyCaptureContent({
    description: "Nova descrição",
    id: "capture-1",
    title: "Nova pendência",
    workspace: updatedNote,
  });

  return updatePersonalReferenceContent({
    id: "reference-1",
    source: "https://example.org",
    title: "Nova fonte",
    workspace: updatedCapture,
  });
}
