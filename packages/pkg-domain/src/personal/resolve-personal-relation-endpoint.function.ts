import { getPersonalRelationEndpointRecordStatus } from "./get-personal-relation-endpoint-record-status.function";
import type { ResolvePersonalRelationEndpointInput } from "./resolve-personal-relation-endpoint-input.interface";
import type { PersonalRelationEndpointResolution } from "../models/personal-relation-endpoint-resolution.interface";

export function resolvePersonalRelationEndpoint(
  input: ResolvePersonalRelationEndpointInput,
): PersonalRelationEndpointResolution {
  if (input.endpoint.id.trim().length === 0) {
    return { endpoint: input.endpoint, status: "invalid" };
  }

  if (
    input.endpoint.recordType === "goal" ||
    input.endpoint.recordType === "question" ||
    input.endpoint.recordType === "topic"
  ) {
    if (input.availableRecordIds.includes(input.endpoint.id)) {
      return { endpoint: input.endpoint, status: "available" };
    }

    if (input.importedRecordIds.includes(input.endpoint.id)) {
      return { endpoint: input.endpoint, status: "imported" };
    }

    return { endpoint: input.endpoint, status: "missing" };
  }

  const matchingRecord = getPersonalRelationEndpointRecordStatus(input);

  if (matchingRecord === "archived") {
    return { endpoint: input.endpoint, status: "archived" };
  }

  if (matchingRecord === "available") {
    return { endpoint: input.endpoint, status: "available" };
  }

  if (input.importedRecordIds.includes(input.endpoint.id)) {
    return { endpoint: input.endpoint, status: "imported" };
  }

  return { endpoint: input.endpoint, status: "missing" };
}
