import type { PersonalRelationContextFilter } from "./personal-relation-context-filter.type";
import type { PersonalRelation } from "@guesant/saberes-application";

export function getPersonalRelationsForContext(
  relations: PersonalRelation[],
  filter: PersonalRelationContextFilter,
): PersonalRelation[] {
  if (filter === "all") {
    return relations;
  }

  return relations.filter((relation) => {
    return relation.source.recordType === filter || relation.target.recordType === filter;
  });
}
