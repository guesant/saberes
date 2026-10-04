import type { UpdatePersonalReferenceContentInput } from "./update-personal-reference-content-input.interface";
import type { PersonalWorkspace } from "@guesant/saberes-application";

export function updatePersonalReferenceContent(
  input: UpdatePersonalReferenceContentInput,
): PersonalWorkspace {
  return {
    ...input.workspace,
    references: input.workspace.references.map((reference) =>
      reference.id === input.id
        ? {
            ...reference,
            title: input.title,
            source: input.source,
            updatedAt: new Date().toISOString(),
          }
        : reference,
    ),
  };
}
