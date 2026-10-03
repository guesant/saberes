import type { KnowledgeGraphEdge } from "./knowledge-graph-edge.interface.ts";
import type { KnowledgeGraphNode } from "./knowledge-graph-node.interface.ts";

export interface KnowledgeGraph {
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
}
