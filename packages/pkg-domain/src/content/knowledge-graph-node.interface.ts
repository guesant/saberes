export interface KnowledgeGraphNode {
  id: string;
  label: string;
  status?: "locked" | "available" | "completed";
}
