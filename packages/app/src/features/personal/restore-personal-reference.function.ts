import type { PersonalWorkspace } from "@guesant/saberes-application";

export function restorePersonalReference(
  workspace: PersonalWorkspace,
  id: string,
): PersonalWorkspace {
  return {
    ...workspace,
    references: workspace.references.map((reference) =>
      reference.id === id ? { ...reference, archived: false } : reference,
    ),
  };
}
