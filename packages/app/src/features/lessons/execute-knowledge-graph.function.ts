import type { BuildKnowledgeGraphPort } from "@guesant/saberes-application";
import type { KnowledgeGraph, KnowledgeMapBlock } from "@guesant/saberes-domain";

export function executeKnowledgeGraph(
  port: BuildKnowledgeGraphPort,
  block: KnowledgeMapBlock | undefined,
): Promise<KnowledgeGraph> {
  if (!block) {
    return Promise.reject(new Error("A knowledge map block is required."));
  }

  return port.execute(block);
}
