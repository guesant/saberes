import type { PersonalWorkspace } from "@guesant/saberes-application";

export interface UpdateStudyCaptureArchiveInput {
  workspace: PersonalWorkspace;
  id: string;
  now: string;
}

export function updateStudyCaptureArchive(
  input: UpdateStudyCaptureArchiveInput,
): PersonalWorkspace {
  return {
    ...input.workspace,
    captures: input.workspace.captures.map((capture) =>
      capture.id === input.id ? { ...capture, archived: true, updatedAt: input.now } : capture,
    ),
  };
}
