import type { PersonalRelationRecordType } from "./personal-relation-record-type.type";

export interface PersonalKnowledgeNode {
  id: string;
  recordType: PersonalRelationRecordType;
  title: string;
  archived: boolean;
}
