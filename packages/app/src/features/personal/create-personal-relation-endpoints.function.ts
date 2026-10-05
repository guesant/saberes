import { parsePersonalRelationRecordType } from "./parse-personal-relation-record-type.function";
import type { CreatePersonalRelationEndpointsInput } from "./create-personal-relation-endpoints-input.interface";
import type { PersonalRelationEndpoints } from "./personal-relation-endpoints.interface";

export function createPersonalRelationEndpoints(
  input: CreatePersonalRelationEndpointsInput,
): PersonalRelationEndpoints | null {
  const sourceRecordType = parsePersonalRelationRecordType(input.sourceType);

  const targetRecordType = parsePersonalRelationRecordType(input.targetType);

  if (!sourceRecordType || !targetRecordType) {
    return null;
  }

  if (!input.sourceId.trim() || !input.targetId.trim()) {
    return null;
  }

  return {
    source: { id: input.sourceId.trim(), recordType: sourceRecordType },
    target: { id: input.targetId.trim(), recordType: targetRecordType },
  };
}
