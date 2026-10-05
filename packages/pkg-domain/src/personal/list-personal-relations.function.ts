import type { ListPersonalRelationsInput } from "./list-personal-relations-input.interface";
import type { PersonalRelation } from "../models/personal-relation.interface";

export function listPersonalRelations(input: ListPersonalRelationsInput): PersonalRelation[] {
  return (input.workspace.relations ?? [])
    .filter((relation) => {
      return input.includeArchived || !relation.archived;
    })
    .filter((relation) => {
      return !input.kind || relation.kind === input.kind;
    })
    .filter((relation) => {
      if (!input.recordId && !input.recordType) {
        return true;
      }

      const endpoints = [relation.source, relation.target];

      return endpoints.some((endpoint) => {
        return (
          (!input.recordId || endpoint.id === input.recordId) &&
          (!input.recordType || endpoint.recordType === input.recordType)
        );
      });
    });
}
