import type { RestorePersonalRelationInput } from "./restore-personal-relation-input.interface";
import type { PersonalWorkspace } from "../models/personal-workspace.interface";

export function restorePersonalRelation(input: RestorePersonalRelationInput): PersonalWorkspace {
  const relations = input.workspace.relations ?? [];

  return {
    ...input.workspace,
    relations: relations.map((relation) => {
      if (relation.id !== input.id || !relation.archived) {
        return relation;
      }

      return { ...relation, archived: false, updatedAt: input.now };
    }),
  };
}
