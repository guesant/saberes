import type { PersonalSearchIndexRecord } from "./personal-search-index-record.type";

export interface PersonalSearchIndexEntry {
  id: string;
  recordId: string;
  recordType: PersonalSearchIndexRecord;
  searchText: string;
  updatedAt: string;
}
