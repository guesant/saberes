import type { PersonalRelationRecordType } from "@guesant/saberes-application";

const recordTypes: Record<string, PersonalRelationRecordType> = {
  activity: "activity",
  capture: "capture",
  checklist: "checklist",
  note: "note",
  reference: "reference",
  topic: "topic",
};

export function parsePersonalRelationRecordType(value: string): PersonalRelationRecordType | null {
  return recordTypes[value.trim()] ?? null;
}
