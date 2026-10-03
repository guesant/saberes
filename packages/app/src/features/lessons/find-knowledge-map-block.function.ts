import type { EditorialBlock, KnowledgeMapBlock } from "@guesant/saberes-domain";

export function findKnowledgeMapBlock(blocks: EditorialBlock[]): KnowledgeMapBlock | undefined {
  return blocks.find((block): block is KnowledgeMapBlock => block.type === "knowledge_map");
}
