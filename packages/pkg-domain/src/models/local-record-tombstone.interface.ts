import type { LocalRecordTombstoneRecordType } from "./local-record-tombstone-record-type.type";

export interface LocalRecordTombstone {
  id: string;
  recordId: string;
  recordType: LocalRecordTombstoneRecordType;
  deletedAt: string;
  reason: "deleted" | "archived" | "replaced";
  schemaVersion: number;
}
