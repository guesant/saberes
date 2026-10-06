import { parseContentReference } from "@guesant/saberes-domain";
import { isRecord } from "./is-record.function";

export function normalizeLegacyContentReferenceRecords(records: unknown): unknown[] {
  if (!Array.isArray(records)) {
    return [];
  }

  return records.filter(isRecord)
    .map((record) => {
      const contentReference = parseContentReference(record.contentKey);

      const migrated = { ...record };

      delete migrated.contentKey;

      if (!contentReference) {
        return migrated;
      }

      return { ...migrated, contentReference };
    });
}
