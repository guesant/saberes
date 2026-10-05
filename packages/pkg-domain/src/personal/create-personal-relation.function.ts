import type { CreatePersonalRelationInput } from "./create-personal-relation-input.interface";
import type { PersonalRelation } from "../models/personal-relation.interface";
import type { PersonalWorkspace } from "../models/personal-workspace.interface";

export function createPersonalRelation(input: CreatePersonalRelationInput): PersonalWorkspace {
  const relations = input.workspace.relations ?? [];

  const existingRelation = relations.find((relation) => {
    return (
      !relation.archived &&
      relation.kind === input.kind &&
      relation.source.id === input.source.id &&
      relation.source.recordType === input.source.recordType &&
      relation.target.id === input.target.id &&
      relation.target.recordType === input.target.recordType
    );
  });

  if (existingRelation) {
    return input.workspace;
  }

  const relation: PersonalRelation = {
    archived: false,
    createdAt: input.now,
    id: input.id,
    kind: input.kind,
    source: input.source,
    target: input.target,
    updatedAt: input.now,
  };

  return { ...input.workspace, relations: [...relations, relation] };
}
