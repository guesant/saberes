import type { PersonalEntitySelection } from "./personal-entity-selection.interface";
import type { PersonalRelation } from "@guesant/saberes-application";

export interface PersonalKnowledgeRelationRowProps {
  relation: PersonalRelation;
  selection: PersonalEntitySelection;
}
