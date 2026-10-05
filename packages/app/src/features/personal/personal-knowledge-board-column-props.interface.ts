import type { PersonalEntitySelection } from "./personal-entity-selection.interface";
import type { PersonalKnowledgeNode } from "@guesant/saberes-application";

export interface PersonalKnowledgeBoardColumnProps {
  nodes: PersonalKnowledgeNode[];
  recordType: string;
  selection: PersonalEntitySelection;
}
