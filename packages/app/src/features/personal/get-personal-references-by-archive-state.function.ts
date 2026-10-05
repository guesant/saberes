import type { PersonalReference } from "@guesant/saberes-application";

export function getPersonalReferencesByArchiveState(
  references: PersonalReference[],
  archived: boolean,
): PersonalReference[] {
  return references.filter((reference) => { return reference.archived === archived; });
}
