import type { PersonalRelationRecordType } from "./personal-relation-record-type.type";

export interface PersonalRelationEndpoint {
  id: string;
  recordType: PersonalRelationRecordType;
}
