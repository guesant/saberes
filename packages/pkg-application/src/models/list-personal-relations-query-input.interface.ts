import type {
  PersonalRelationKind,
  PersonalRelationRecordType,
} from "@guesant/saberes-domain";

export interface ListPersonalRelationsQueryInput {
  includeArchived?: boolean;
  kind?: PersonalRelationKind;
  recordId?: string;
  recordType?: PersonalRelationRecordType;
}
