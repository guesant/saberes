import type { EditorialBlock } from "@guesant/saberes-application";

export function getVisibleContentBlocks(
  blocks: EditorialBlock[],
  showRichContent: boolean,
): EditorialBlock[] {
  return showRichContent
    ? blocks
    : blocks.filter((block) => {
      return !["chart", "knowledge_map", "parametric_scene", "video"].includes(block.type);
    });
}
