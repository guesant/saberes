import type { PersonalRelationEndpointResolution } from "../models/personal-relation-endpoint-resolution.interface";
import type { PersonalRelationResolutionState } from "../models/personal-relation-resolution-state.type";

export function resolvePersonalRelationState(
  source: PersonalRelationEndpointResolution,
  target: PersonalRelationEndpointResolution,
  archived: boolean,
): PersonalRelationResolutionState {
  if (archived) {
    return "archived";
  }

  if (source.status === "invalid" && target.status === "invalid") {
    return "invalid-both";
  }

  if (source.status === "invalid") {
    return "invalid-source";
  }

  if (target.status === "invalid") {
    return "invalid-target";
  }

  if (source.status === "missing" && target.status === "missing") {
    return "missing-both";
  }

  if (source.status === "missing") {
    return "missing-source";
  }

  if (target.status === "missing") {
    return "missing-target";
  }

  if (source.status === "imported" && target.status === "imported") {
    return "imported-both";
  }

  if (source.status === "imported") {
    return "imported-source";
  }

  if (target.status === "imported") {
    return "imported-target";
  }

  if (source.status === "archived" || target.status === "archived") {
    return "partially-restored";
  }

  return "active";
}
