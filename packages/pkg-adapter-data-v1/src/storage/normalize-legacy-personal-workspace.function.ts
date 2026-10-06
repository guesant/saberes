import { isRecord } from "./is-record.function";
import { normalizeLegacyContentReferenceRecords } from "./normalize-legacy-content-reference-records.function";

export function normalizeLegacyPersonalWorkspace(value: unknown): unknown {
  if (!isRecord(value)) {
    return value;
  }

  return {
    ...value,
    activities: normalizeLegacyContentReferenceRecords(value.activities),
    captures: normalizeLegacyContentReferenceRecords(value.captures),
    checklists: normalizeLegacyContentReferenceRecords(value.checklists),
    notes: normalizeLegacyContentReferenceRecords(value.notes),
    references: normalizeLegacyContentReferenceRecords(value.references),
  };
}
