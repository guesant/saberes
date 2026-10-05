import type { PersonalLensView } from "./personal-lens-view.type";
import type { PersonalRelationRecordType } from "./personal-relation-record-type.type";

export interface PersonalLens {
  id: string;
  name: string;
  view: PersonalLensView;
  recordTypes: PersonalRelationRecordType[];
  createdAt: string;
  updatedAt: string;
}
