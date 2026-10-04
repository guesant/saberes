import type { PersonalWorkspace } from "@guesant/saberes-application";

export function deletePersonalReference(
  workspace: PersonalWorkspace,
  id: string,
): PersonalWorkspace {
  return {
    ...workspace,
    references: workspace.references.map((reference) => {
      return reference.id === id ? { ...reference, archived: true } : reference;
    }),
  };
}
