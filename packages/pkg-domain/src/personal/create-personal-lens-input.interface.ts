import type { PersonalLensView } from "../models/personal-lens-view.type";
import type { PersonalRelationRecordType } from "../models/personal-relation-record-type.type";
import type { PersonalWorkspace } from "../models/personal-workspace.interface";

export interface CreatePersonalLensInput {
  id: string;
  name: string;
  now: string;
  recordTypes: PersonalRelationRecordType[];
  view: PersonalLensView;
  workspace: PersonalWorkspace;
}
