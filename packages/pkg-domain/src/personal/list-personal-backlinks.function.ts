import { listPersonalRelations } from "./list-personal-relations.function";
import type { ListPersonalBacklinksInput } from "./list-personal-backlinks-input.interface";
import type { PersonalRelation } from "../models/personal-relation.interface";

export function listPersonalBacklinks(input: ListPersonalBacklinksInput): PersonalRelation[] {
  return listPersonalRelations({
    kind: "backlink",
    workspace: input.workspace,
  })
    .filter((relation) => {
      if (!input.recordId && !input.recordType) {
        return true;
      }

      return (
        (!input.recordId || relation.target.id === input.recordId) &&
      (!input.recordType || relation.target.recordType === input.recordType)
      );
    });
}
