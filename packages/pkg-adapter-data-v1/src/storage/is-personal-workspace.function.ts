import type { PersonalWorkspace } from "@guesant/saberes-domain";

export function isPersonalWorkspace(value: unknown): value is PersonalWorkspace {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return (
    "notes" in value &&
    "checklists" in value &&
    "captures" in value &&
    "references" in value &&
    Array.isArray(value.notes) &&
    Array.isArray(value.checklists) &&
    Array.isArray(value.captures) &&
    Array.isArray(value.references)
  );
}
