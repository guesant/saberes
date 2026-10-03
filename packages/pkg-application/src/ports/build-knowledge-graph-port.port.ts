import type { KnowledgeGraph, KnowledgeMapBlock } from "@guesant/saberes-domain";

export interface BuildKnowledgeGraphPort {
  execute(block: KnowledgeMapBlock): Promise<KnowledgeGraph>;
}
