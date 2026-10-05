import type { ArchivePersonalRelationInput } from "./archive-personal-relation-input.interface";
import type { PersonalWorkspace } from "../models/personal-workspace.interface";

export function archivePersonalRelation(input: ArchivePersonalRelationInput): PersonalWorkspace {
  const relations = input.workspace.relations ?? [];

  return {
    ...input.workspace,
    relations: relations.map((relation) => {
      if (relation.id !== input.id || relation.archived) {
        return relation;
      }

      return { ...relation, archived: true, updatedAt: input.now };
    }),
  };
}
