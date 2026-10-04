import type { EditorialBlock, KnowledgeMapBlock } from "@guesant/saberes-application";

export function findKnowledgeMapBlock(blocks: EditorialBlock[]): KnowledgeMapBlock | undefined {
  return blocks.find((block): block is KnowledgeMapBlock => {
    return block.type === "knowledge_map";
  });
}
