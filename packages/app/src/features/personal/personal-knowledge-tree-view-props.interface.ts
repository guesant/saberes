import type { PersonalEntitySelection } from "./personal-entity-selection.interface";
import type { PersonalKnowledgeProjection } from "@guesant/saberes-application";

export interface PersonalKnowledgeTreeViewProps {
  projection: PersonalKnowledgeProjection;
  selection: PersonalEntitySelection;
}
