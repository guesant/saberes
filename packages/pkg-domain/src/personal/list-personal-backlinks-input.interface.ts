import type { PersonalRelationRecordType } from "../models/personal-relation-record-type.type";
import type { PersonalWorkspace } from "../models/personal-workspace.interface";

export interface ListPersonalBacklinksInput {
  recordId?: string;
  recordType?: PersonalRelationRecordType;
  workspace: PersonalWorkspace;
}
