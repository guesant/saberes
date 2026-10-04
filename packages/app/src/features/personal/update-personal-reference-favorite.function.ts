import type { PersonalWorkspace } from "@guesant/saberes-application";

export interface UpdatePersonalReferenceFavoriteInput {
  workspace: PersonalWorkspace;
  id: string;
  now: string;
}

export function updatePersonalReferenceFavorite(
  input: UpdatePersonalReferenceFavoriteInput,
): PersonalWorkspace {
  return {
    ...input.workspace,
    references: input.workspace.references.map((reference) =>
      reference.id === input.id
        ? { ...reference, favorite: !reference.favorite, updatedAt: input.now }
        : reference,
    ),
  };
}
