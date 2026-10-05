import type { PersonalEntitySelection } from "./personal-entity-selection.interface";
import type { PersonalRelationEndpoint } from "@guesant/saberes-application";

export interface PersonalKnowledgeSelectionTestState {
  getSelected(): PersonalRelationEndpoint | undefined;
  selection: PersonalEntitySelection;
}
