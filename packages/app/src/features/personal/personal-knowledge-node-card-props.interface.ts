import type { PersonalKnowledgeNode } from "@guesant/saberes-application";

export interface PersonalKnowledgeNodeCardProps {
  node: PersonalKnowledgeNode;
  onSelect(endpoint: PersonalKnowledgeNode): void;
  selected: boolean;
}
