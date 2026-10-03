import type { KnowledgeGraphEdge } from "./knowledge-graph-edge.interface.ts";
import type { KnowledgeGraphNode } from "./knowledge-graph-node.interface.ts";

export interface KnowledgeMapBlock {
  type: "knowledge_map";
  title?: string;
  nodes: KnowledgeGraphNode[];
  edges: Array<Omit<KnowledgeGraphEdge, "id">>;
}
