import type {
  BuildKnowledgeGraphPort,
  KnowledgeGraph,
  KnowledgeMapBlock,
} from "@guesant/saberes-application";

export function executeKnowledgeGraph(
  port: BuildKnowledgeGraphPort,
  block: KnowledgeMapBlock | undefined,
): Promise<KnowledgeGraph> {
  if (!block) {
    return Promise.reject(new Error("A knowledge map block is required."));
  }

  return port.execute(block);
}
