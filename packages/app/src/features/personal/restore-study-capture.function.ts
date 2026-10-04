import type { PersonalWorkspace } from "@guesant/saberes-application";

export function restoreStudyCapture(workspace: PersonalWorkspace, id: string): PersonalWorkspace {
  return {
    ...workspace,
    captures: workspace.captures.map((capture) =>
      capture.id === id ? { ...capture, archived: false } : capture,
    ),
  };
}
