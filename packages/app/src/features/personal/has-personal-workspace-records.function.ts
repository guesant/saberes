import type { PersonalWorkspace } from "@guesant/saberes-application";

export function hasPersonalWorkspaceRecords(workspace: PersonalWorkspace): boolean {
  const recordCounts = [
    workspace.activities.length,
    workspace.notes.length,
    workspace.checklists.length,
    workspace.captures.length,
    workspace.references.length,
    workspace.relations?.length ?? 0,
  ];

  return recordCounts.some((count) => { return count > 0; });
}
