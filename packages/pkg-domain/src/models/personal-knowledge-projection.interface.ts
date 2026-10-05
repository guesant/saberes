import type { PersonalKnowledgeNode } from "./personal-knowledge-node.interface";
import type { PersonalRelation } from "./personal-relation.interface";

export interface PersonalKnowledgeProjection {
  nodes: PersonalKnowledgeNode[];
  relations: PersonalRelation[];
}
