import type { PersonalLensView } from "../models/personal-lens-view.type";
import type { PersonalRelationRecordType } from "../models/personal-relation-record-type.type";

export interface PersonalLensComparison {
  changedRecordTypes: PersonalRelationRecordType[];
  changedView: boolean;
  currentView: PersonalLensView;
  candidateView: PersonalLensView;
  sameName: boolean;
}
