import type { PersonalWorkspace } from "@guesant/saberes-application";

export function deleteStudyCapture(workspace: PersonalWorkspace, id: string): PersonalWorkspace {
  return {
    ...workspace,
    captures: workspace.captures.map((capture) =>
      capture.id === id ? { ...capture, archived: true } : capture,
    ),
  };
}
