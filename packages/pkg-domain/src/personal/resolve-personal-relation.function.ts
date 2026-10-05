import { resolvePersonalRelationEndpoint } from "./resolve-personal-relation-endpoint.function";
import { resolvePersonalRelationState } from "./resolve-personal-relation-state.function";
import type { ResolvePersonalRelationInput } from "./resolve-personal-relation-input.interface";
import type { PersonalRelationResolution } from "../models/personal-relation-resolution.interface";

export function resolvePersonalRelation(
  input: ResolvePersonalRelationInput,
): PersonalRelationResolution {
  const importedRecordIds = input.importedRecordIds ?? [];

  const source = resolvePersonalRelationEndpoint({
    availableRecordIds: input.availableRecordIds,
    endpoint: input.relation.source,
    importedRecordIds,
    workspace: input.workspace,
  });

  const target = resolvePersonalRelationEndpoint({
    availableRecordIds: input.availableRecordIds,
    endpoint: input.relation.target,
    importedRecordIds,
    workspace: input.workspace,
  });

  return {
    relation: input.relation,
    source,
    state: resolvePersonalRelationState(source, target, input.relation.archived),
    target,
  };
}
