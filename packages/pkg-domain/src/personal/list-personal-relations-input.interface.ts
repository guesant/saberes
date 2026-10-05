import type { PersonalRelationKind } from "../models/personal-relation-kind.type";
import type { PersonalRelationRecordType } from "../models/personal-relation-record-type.type";
import type { PersonalWorkspace } from "../models/personal-workspace.interface";

export interface ListPersonalRelationsInput {
  includeArchived?: boolean;
  kind?: PersonalRelationKind;
  recordId?: string;
  recordType?: PersonalRelationRecordType;
  workspace: PersonalWorkspace;
}
