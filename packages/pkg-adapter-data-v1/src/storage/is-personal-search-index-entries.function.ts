import type { PersonalSearchIndexEntry } from "./personal-search-index-entry.interface";
import type { PersonalSearchIndexRecord } from "./personal-search-index-record.type";

const personalSearchIndexRecords: PersonalSearchIndexRecord[] = [
  "activity",
  "capture",
  "checklist",
  "note",
  "reference",
];

export function isPersonalSearchIndexEntries(value: unknown): value is PersonalSearchIndexEntry[] {
  if (!Array.isArray(value)) {
    return false;
  }

  return value.every((entry) => {
    if (typeof entry !== "object" || entry === null) {
      return false;
    }

    if (
      !("id" in entry) ||
      !("recordId" in entry) ||
      !("recordType" in entry) ||
      !("searchText" in entry) ||
      !("updatedAt" in entry)
    ) {
      return false;
    }

    return (
      typeof entry.id === "string" &&
      typeof entry.recordId === "string" &&
      typeof entry.recordType === "string" &&
      personalSearchIndexRecords.some((record) => {return record === entry.recordType;}) &&
      typeof entry.searchText === "string" &&
      typeof entry.updatedAt === "string"
    );
  });
}
