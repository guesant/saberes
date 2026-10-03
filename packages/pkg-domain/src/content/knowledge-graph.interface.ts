import type { KnowledgeGraphEdge } from "./knowledge-graph-edge.interface";
import type { KnowledgeGraphNode } from "./knowledge-graph-node.interface";

export interface KnowledgeGraph {
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
}
