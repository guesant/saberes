import type { PersonalEntitySelection } from "./personal-entity-selection.interface";
import type { PersonalKnowledgeProjection } from "@guesant/saberes-application";

export interface PersonalKnowledgeBoardViewProps {
  projection: PersonalKnowledgeProjection;
  selection: PersonalEntitySelection;
}
